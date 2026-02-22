import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object stored on the Node.js global object.
 * This prevents creating multiple connections during development when Next.js
 * reloads modules on every request / HMR.
 */
interface MongooseGlobalCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the Node.js global type to include our Mongoose cache.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseGlobalCache | undefined;
}

/**
 * Use a global cache in development to persist the connection across module reloads.
 * In production, modules are loaded once so this is effectively a simple singleton.
 */
const cached: MongooseGlobalCache = global._mongoose ?? {
  conn: null,
  promise: null,
};

// Initialize the global cache once so it can be reused by subsequent imports
if (!global._mongoose) {
  global._mongoose = cached;
}

/**
 * Establishes (or reuses) a Mongoose connection to MongoDB.
 *
 * - Reuses an existing connection if it is already open.
 * - Otherwise, creates a new connection and caches the connection promise.
 *
 * Throws an error if `MONGODB_URI` is not defined.
 */
export async function connectToDatabase(): Promise<Connection> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // If a connection is already established, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no active connection but an in-flight connection promise exists,
  // reuse that promise instead of opening a new connection.
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      // Place for production-ready options, e.g. serverSelectionTimeoutMS, autoIndex, etc.
    };

    cached.promise = mongoose.connect(uri, options);
  }

  const mongooseInstance = await cached.promise;

  // Cache the actual connection for future calls.
  cached.conn = mongooseInstance.connection;

  return cached.conn;
}

export default connectToDatabase;

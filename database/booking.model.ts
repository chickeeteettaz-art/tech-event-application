import mongoose, { Schema, model, models, HydratedDocument } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking domain type used across the application.
 */
export interface Booking {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

/**
 * Simple email validation pattern (RFC-complete is unnecessary for typical app usage).
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for faster lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value: string): boolean {
          return EMAIL_REGEX.test(value);
        },
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  },
);

/**
 * Pre-save hook to:
 * - ensure the referenced event exists
 * - double-check email formatting prior to persistence
 */
BookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    // Validate email formatting at the hook level as a safety net.
    if (!EMAIL_REGEX.test(this.email)) {
      throw new Error('Invalid email address');
    }

    // Verify that the associated event exists before creating the booking.
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error('Cannot create booking: referenced event does not exist');
    }


      next();
  } catch (error) {
    next(error as Error);
  }
});

// Reuse existing model in dev environments to avoid OverwriteModelError
export const Booking = (models.Booking as mongoose.Model<BookingDocument>) ||
  model<Booking>('Booking', BookingSchema);

export default Booking;

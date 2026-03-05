import mongoose, { Schema, model, models, HydratedDocument } from 'mongoose';
import Event from './event.model';

/**
 * Booking domain type used across the application.
 */
export interface Booking {
  /**
   * Either eventId or slug must be provided when creating a booking.
   * eventId will ultimately be stored; slug is a convenience input.
   */
  eventId?: mongoose.Types.ObjectId;
  slug?: string;
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
      required: false, // allow slug-only creation; validated in middleware
      index: true, // index for faster lookups by event
    },
    slug: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      index: true,
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
BookingSchema.pre<BookingDocument>('save', async function preSave() {
  // Validate email formatting at the hook level as a safety net.
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error('Invalid email address');
  }

  // Ensure we have a reference to an event: either eventId or slug must be provided
  if (!this.eventId && !this.slug) {
    throw new Error('Cannot create booking: either eventId or slug must be provided');
  }

  // If eventId is missing but slug is provided, resolve slug to eventId
  if (!this.eventId && this.slug) {
    const normalisedSlug = this.slug.toLowerCase().trim();
    const event = await Event.findOne({ slug: normalisedSlug }).select('_id').lean();
    if (!event) {
      throw new Error('Cannot create booking: event with the provided slug does not exist');
    }
    // assign the resolved eventId and normalised slug back to the doc
    this.eventId = (event as { _id: mongoose.Types.ObjectId })._id;
    this.slug = normalisedSlug;
  }

  // If both provided, ensure they are consistent
  if (this.eventId && this.slug) {
    const normalisedSlug = this.slug.toLowerCase().trim();
    const match = await Event.exists({ _id: this.eventId, slug: normalisedSlug });
    if (!match) {
      throw new Error('Cannot create booking: provided eventId does not match the slug');
    }
    this.slug = normalisedSlug;
  }

  // Final safety: verify that the associated event exists by id.
  if (this.eventId) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error('Cannot create booking: referenced event does not exist');
    }
  }
});

// Reuse existing model in dev environments to avoid OverwriteModelError
export const Booking = (models.Booking as mongoose.Model<BookingDocument>) ||
  model<Booking>('Booking', BookingSchema);

export default Booking;

import mongoose, { Schema, model, models, HydratedDocument } from 'mongoose';

/**
 * Event domain type used across the application.
 */
export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as ISO date string (YYYY-MM-DD)
  time: string; // stored as 24h time string (HH:MM)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;

/**
 * Basic, dependency-free slug generator used in a pre-save hook.
 */
const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    // Replace non-alphanumeric characters with dashes
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '');
};

/**
 * Normalize a date input into `YYYY-MM-DD` (ISO date portion only).
 * Throws if the date is invalid.
 */
const normalizeDateToISO = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }
  return parsed.toISOString().split('T')[0];
};

/**
 * Normalize a time string into `HH:MM` 24-hour format.
 * Accepts basic `H:MM` / `HH:MM` inputs and pads as needed.
 */
const normalizeTime = (value: string): string => {
  const trimmed = value.trim();

  // Match H:MM or HH:MM where H/HH is 0-23 and MM is 0-59
  const match = trimmed.match(/^([0-9]{1,2}):([0-9]{2})$/);
  if (!match) {
    throw new Error('Time must be in H:MM or HH:MM 24-hour format');
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time value');
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return `${hh}:${mm}`;
};

const EventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  },
);

// Ensure a unique index on slug at the schema level
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to:
 * - validate required string/array fields are non-empty
 * - normalize date and time formats
 * - generate or update slug only when the title changes
 */
EventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    // Validate core string fields are non-empty
    const stringFields: (keyof Event)[] = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'mode',
      'audience',
      'organizer',
    ];

    for (const field of stringFields) {
      const value = this[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Field "${String(field)}" is required and must be a non-empty string`);
      }
    }

    // Validate non-empty arrays for agenda and tags
    const arrayFields: (keyof Event)[] = ['agenda', 'tags'];
    for (const field of arrayFields) {
      const value = this[field];
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`Field "${String(field)}" is required and must be a non-empty array`);
      }
      if (!value.every((item) => typeof item === 'string' && item.trim().length > 0)) {
        throw new Error(`Field "${String(field)}" must contain only non-empty strings`);
      }
    }

    // Normalize date and time into consistent formats
    this.date = normalizeDateToISO(this.date);
    this.time = normalizeTime(this.time);

    // Generate slug if new or when title has changed
    if (this.isNew || this.isModified('title')) {
      this.slug = toSlug(this.title);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Reuse existing model in dev environments to avoid OverwriteModelError
export const Event = (models.Event as mongoose.Model<EventDocument>) ||
  model<Event>('Event', EventSchema);

export default Event;

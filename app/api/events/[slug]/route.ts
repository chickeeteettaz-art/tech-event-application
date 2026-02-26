import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

/**
 * GET /api/events/[slug]
 *
 * Fetch a single event by its slug.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
    let { slug } = await context.params;
  const rawSlug = slug

  // Basic validation for slug parameter
  if (typeof rawSlug !== 'string' || rawSlug.trim().length === 0) {

    return NextResponse.json(
      { message: `A valid event slug ${rawSlug} must be provided.` },
      { status: 400 },
    );
  }

  // Normalise slug to match how we store it in the database
  slug = decodeURIComponent(rawSlug).trim().toLowerCase();

  try {
    // Ensure database connection is established before querying
    await connectDB();

    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found.' },
        { status: 404 },
      );
    }

    // Optionally hide internal fields if needed (e.g. __v)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, ...sanitisedEvent } = event as typeof event & { __v?: number };

    return NextResponse.json(sanitisedEvent, { status: 200 });
  } catch (error) {
    // Differentiate between known validation-like errors and unexpected ones
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Failed to fetch event.',
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch event due to an unexpected error.' },
      { status: 500 },
    );
  }
}

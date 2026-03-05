"use server"

import connectDB from "@/lib/mongodb";
import {Booking} from "@/database/booking.model";

export const createBooking = async ({eventId,slug,email}:{eventId:string,slug:string,email:string}) => {
    try {
        await connectDB()

        const bookingDoc = await Booking.create({eventId,slug,email});
        // Return only plain serializable primitives to the client
        return { success: true, bookingId: bookingDoc._id.toString() }

    }catch (e) {
        console.log('creation of booking failed',e)
        // Avoid returning raw Error object to the client; send a simple message
        const message = e instanceof Error ? e.message : 'Unknown error';
        return {success:false, error: message}
    }
}
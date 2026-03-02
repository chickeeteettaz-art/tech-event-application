"use server";

import {Event} from "@/database";
import connectDB from "@/lib/mongodb";

export const getSimilarEvents = async (slug:string) =>{

    try {
        await connectDB()

        const event = await Event.findOne({slug: slug})
        return await Event.find(
            {
                _id: {$ne: event._id, tags: {$in: event.tags}}
            })

    } catch (e) {
        console.error(e)
        return []
    }
}
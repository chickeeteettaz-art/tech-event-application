import React from 'react'
import {notFound} from "next/navigation";

const EventDetailsPage = async ({params}:{params:Promise<{slug:string}>}) => {

    const {slug} = await params;

    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
    const {sanitisedEvent} = await request.json();

    if(!sanitisedEvent) return notFound()
    return (
        <section id='id'>
            <h1>Event Details:{slug}</h1>
        </section>
    )
}
export default EventDetailsPage

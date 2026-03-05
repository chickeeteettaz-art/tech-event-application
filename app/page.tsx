import React from 'react'
import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database/event.model";
import {cacheLife} from "next/cache";

const Page = async () => {

    "use cache"
    cacheLife("hours")
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/events`);
    const {events} = await response.json();

    return (
        <section>
            <h1 className={'text-center'}>The Hub for Every Dev Event <br/> You cannot miss</h1>
            <p className='text-center mt-5'>
                Hackathons, Meetups, and Conferences, All in one Place
            </p>
            <ExploreButton/>

            <div className={'mt-20 space-y-7'}>
                <h3>Featured Events</h3>

                    <ul className='events'>
                        {events && events.length > 0 && events.map((event:IEvent) => (
                            <li key={event.title} className={'list-none'}>
                                <EventCard {...event}/>
                            </li>
                        ))}
                    </ul>
            </div>
        </section>

    )
}
export default Page

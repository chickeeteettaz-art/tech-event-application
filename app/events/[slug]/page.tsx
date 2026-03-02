import React from 'react'
import {notFound} from "next/navigation";
import Image from 'next/image'
import BookEvent from "@/components/BookEvent";
import {getSimilarEvents} from "@/lib/actions/event.actions";
import {IEvent} from "@/database/event.model";

const EventDetailsItem = ({icon,alt,label}:{icon:string,alt:string,label:string}) =>(
    <div className={'flex gap-2 items-center'}>
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
)

const EventAgendaItem = ({agendaItems}:{agendaItems:string[]}) => (
    <div className={'flex flex-col gap-2'}>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li className={'text-light-100 text-lg max-sm:text-sm'} key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

//event tags

const EventTags = ({tags}:{tags:string[]}) => (
    <div className={'flex flex-row gap-1.5 flex-wrap'}>
        {tags.map((tag) => (
            <div className={'pill'} key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({params}:{params:Promise<{slug:string}>}) => {

    const {slug} = await params;

    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
    const {sanitisedEvent:{organizer,description,image,overview,title,date,time,location,mode,agenda,audience,tags}} = await request.json();

    if(!description) return notFound()

    const bookings = 10;

    const similarEvents:IEvent[] = await getSimilarEvents(slug)

    return (
        <section id='id'>
            <div className={'flex w-2/3 flex-col items-start gap-4 max-lg:w-full mb-10'}>
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className={'flex w-full flex-col lg:flex-row gap-12 items-start mt-12 max-lg:items-center'}>
                {/*Left side*/}

                <div className={'flex flex-[2] flex-col gap-8 max-lg:w-full'}>
                    <Image src={image} alt={title} width={810} height={800} className={'banner'}/>

                    <section className={'flex-col-gap-2'}>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className={'flex-col-gap-2'}>
                        <h2>Event Details</h2>
                        <EventDetailsItem icon={'/icons/calendar.svg'} alt={'date'} label={date}/>
                        <EventDetailsItem icon={'/icons/clock.svg'} alt={'time'} label={time}/>
                        <EventDetailsItem icon={'/icons/pin.svg'} alt={'location'} label={location}/>
                        <EventDetailsItem icon={'/icons/mode.svg'} alt={'mode'} label={mode}/>
                        <EventDetailsItem icon={'/icons/audience.svg'} alt={'audience'} label={audience}/>
                    </section>

                    <EventAgendaItem agendaItems={JSON.parse(agenda)}/>

                    <section className={'flex-col-gap-2'}>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={JSON.parse(tags[0])}/>
                </div>

                {/*Right side*/}
                <aside className={'flex-1 w-full p-4 border-l border-gray-700'}>
                    <div className={'bg-dark-100 border-dark-200 card-shadow flex w-full flex-col gap-6 rounded-[10px] border px-5 py-6'}>
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className={'text-sm'}>
                                Join {bookings} people interested in this event.
                            </p>
                        ):(
                            <p className={'text-sm'}>Be the first to book your spot!</p>
                        )}

                        <BookEvent/>
                    </div>
                </aside>
            </div>

            <div></div>
        </section>
    )
}
export default EventDetailsPage

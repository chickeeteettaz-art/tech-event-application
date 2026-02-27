import React from 'react'
import {notFound} from "next/navigation";
import Image from 'next/image'

const EventDetailsItem = ({icon,alt,label}:{icon:string,alt:string,label:string}) =>(
    <div className={'flex gap-2 items-center'}>
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
)

const EventAgendaItem = ({agendaItems}:{agendaItems:string[]}) => (
    <div className={'agenda'}>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
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
    return (
        <section id='id'>
            <div className={'header'}>
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className={'details'}>
                {/*Left side*/}

                <div className={'content'}>
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
                <aside className={'booking'}>
                    <p className={'text-lg font-semibold'}>Book Event</p>
                </aside>
            </div>
        </section>
    )
}
export default EventDetailsPage

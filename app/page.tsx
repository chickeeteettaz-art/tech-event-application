import React from 'react'
import ExploreButton from "@/components/ExploreButton";

const Page = () => {
    return (
        <section>
            <h1 className={'text-center'}>The Hub for Every Dev Event <br/> You cannot miss</h1>
            <p className='text-center mt-5'>
                Hackathons, Meetups, and Conferences, All in one Place
            </p>
            <ExploreButton/>

            <div className={'mt-20 space-y-7'}>
                <h3>Featured Events</h3>

                <ul>
                    {[1,2,3,4,5].map((item) => (
                        <li key={item}>Event {item}</li>

                    ))}
                </ul>
            </div>
        </section>

    )
}
export default Page

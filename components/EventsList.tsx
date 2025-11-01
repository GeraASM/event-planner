"use client";

import {format} from "date-fns"
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/models";
import Image from "next/image";



interface EventsListProps {
    events: Event[];
}


export default function EventsList({events}: EventsListProps) {
    
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get("search") as string;
        const filter = formData.get("filter") as string;
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filter) params.set("filter", filter);
        console.log(params.toString());
        router.push(`/events?${params}`)
    } 
    
    return (
        <section className="space-y-6">
            {/* Search and Filter */}
            <div className="card p-3">
                <form onSubmit={handleSubmit} action="" className="flex gap-2">
                    <input className="input-field" type="search" name="search" id="search" placeholder="Search events..." />
                    <div className="flex gap-2"> 
                        <select className="focus:outline-0 input-field w-[140px] px-2" name="filter" id="filter">
                            <option value="All Events">All Events</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Past">Past</option>
                        </select>
                        <button className="btn-submit" type="submit">Filter</button>

                    </div>
                </form>
            </div>

            {
                events.length === 0 ? 
                <div className="text-center"><p className="text-muted text-lg">No events found</p>
                    <Link href={"/events/create"} className="btn-primary mt-4 btn-submit inline-block">Create the first event</Link>
                </div> :

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        events.map((event: Event, key) => (
                            <div key={key} className="card p-3 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-2">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                                    <p className="text-muted mb-4">{event.description}</p>
                                    <div className="flex gap-2">
                                        <Image width={100} height={100} className="w-5 h-5 object-contain" src="/assets/date.svg" alt="Date" />
                                        <p className="text-muted">
                                            {format(new Date(event.date), "PPP 'at' p")}
                                        </p>

                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image width={100} height={100} className="w-5 h-5 object-contain" src="/assets/location.svg" alt="Location" />
                                        <p className="text-muted">{event.location}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image width={100} height={100} className="w-5 h-5 object-contain" src="/assets/people.svg" alt="Members" />
                                        <p className="text-muted">{event.maxAttendees}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image width={100} height={100} className="w-5 h-5 object-contain" src="/assets/people.svg" alt="User" />
                                        <p className="text-muted">{event.user.name || "unknown"}</p>
                                    </div>
                                    <div className="mt-2">
                                        <Link className="hover:text-primary text-primary transition-colors duration-200 hover:bg-foreground px-2 py-1 font-medium rounded" href={`/events/${event.id}`}>View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            
        </section>
    )
}
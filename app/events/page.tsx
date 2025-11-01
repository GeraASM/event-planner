import {auth} from "@/auth";
import Link from "next/link";
import EventsList from "@/components/EventsList";
export default async function EventsPage({searchParams}: {searchParams: Promise<{search: string; filter: string}>}) {
    const session = await auth();
    const {search, filter} = await searchParams;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("filter", filter);
    const events = await fetch(`http://localhost:3000/api/events?${params.toString()}`, {next: {tags: ['events']}}).then(res =>{
        if (res.ok) {return res.json() || [];}
    } );
    console.log(events);
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Events</h1>
                    <p className="text-muted mt-2">Discover and join amazing events in your area</p>
                </div>
                {
                    session &&
                    <Link href="/events/create" className="btn-submit">Create Event</Link>

                }
            </div>
            <EventsList events={events} />
        </div>
    )
}
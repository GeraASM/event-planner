import { auth } from "@/auth"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
interface Count {
  rsvps: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count: Count;
}
interface EventRSVPS {
  createdAt: string;
  date: string;
  description: string;
  id: string;
  isPublic: boolean;
  location: string;
  maxAttendees: number;
  title: string;
  updatedAt: string;
}

interface RSVPS {
  createdAt: string;
  event: EventRSVPS & {user: {name: string}};
  eventId: string;
  id: string;
  status: "NOT_GOING" | "GOING" | "MAYBE";
  updatedAt: string;
  userId: string;
}



const dateFormatEU = new Intl.DateTimeFormat("en-Us", {dateStyle: "long", timeStyle: "short"})

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
            redirect("/login")
    }

    const rsvpsEventsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/rsvps`, {
        next: { tags: ["rsvps"] },
        credentials: "include",
    });

    const rsvpsEvents: RSVPS[] = rsvpsEventsRes.ok ? await rsvpsEventsRes.json() : [];

   const userEventsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/events`, {
    next: { tags: ["events"] },
    credentials: "include",
});

    const userEvents = userEventsRes.ok ? await userEventsRes.json() : [];
    console.log(rsvpsEvents);
    
    const now = new Date();
    const upcomingEvents: Event[] = userEvents.filter((event: Event) => new Date(event.date) >= now)
    const pastEvents: Event[] = userEvents.filter((event: Event) => new Date(event.date) < now)
    return (
        <div className="space-y-8">
            <div>
                
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted mt-2">Welcome back {session.user.name || session.user.email} </p>
            </div>
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link className="btn-submit" href="/events/create">Create New Event</Link>
                    <Link className="btn-secondary" href="/events">Browse All Events</Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground">Total Events</h3>
                    <p className="text-3xl font-bold text-primary">{userEvents.length}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
                    <p className="text-3xl font-bold text-primary">{upcomingEvents.length}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground">Past Events</h3>
                    <p className="text-3xl font-bold text-primary">{pastEvents.length}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground">My RSVPs</h3>
                    <p className="text-3xl font-bold text-primary">{rsvpsEvents.length}</p>
                </div>

            </div>
            {/* My events */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">My Events</h2>
                    <Link className="block text-primary hover:text-primary transition-colors" href="/events/create">+ Create Event </Link>
                </div>
                <div>
                    {userEvents.length > 0 
                    ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userEvents.map((event: Event, key: number) => (
                            <div key={key} className="card p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                                <p className="text-muted mb-4">{event.description}</p>
                                <div className="space-y-2 text-sm text-muted mb-4">
                                    <div className="flex items-center gap-2">
                                        <Image width={20} height={20} src="/assets/calendar.svg" alt="Calendar" />
                                        <p className="text-muted">{dateFormatEU.format(new Date(event.date))}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-muted mb-4">
                                    <div className="flex items-center gap-2">
                                        <Image width={20} height={20} src="/assets/people.svg" alt="Calendar" />
                                        <p className="text-muted">{event._count.rsvps} RSVPs</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> 
                    : <div className="card p-8 text-center"><p className="text-muted">You haven&apos;t created any events</p></div>}

                </div>
            </div>


            {/* My RSVPs */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">My RSVPs</h2>
                </div>
                <div>
                    {
                    rsvpsEvents.length > 0
                    ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rsvpsEvents.map((rsvp: RSVPS, key: number) => (
                            <div key={key} className="card p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-2">{rsvp.event.title}</h3>
                                <div className=
                                {
                                    `
                                    p-2 w-fit rounded
                                    ${
                                        rsvp.status == "NOT_GOING" 
                                    ? "bg-red-600/20 text-red-400" 
                                    : rsvp.status == "GOING" 
                                    ? "bg-green-600/20 text-green-400" 
                                    : rsvp.status == "MAYBE" 
                                    ? "bg-yellow-600/20 text-yellow-400" 
                                    : "" 
                                    }
                                    `
                                }>
                                    {rsvp.status}
                                </div>
                                <div>
                                    {rsvp.event.description}
                                </div>
                                <div className="flex gap-2 items-center">
                                     <Image height={20} width={20} src="/assets/calendar.svg" alt="Calendar" />
                                    <p className="text-muted">{dateFormatEU.format(new Date(rsvp.event.date))}</p>
                                </div>
                                <div className="text-muted mb-2 text-center flex items-center gap-2">
                                    <Image height={20} width={20} src="/assets/people.svg" alt="Calendar" />
                                    <p>By {rsvp.event.user.name}</p>
                                </div>
                                <Link className="btn-submit w-full" href={`/events/${rsvp.event.id}`}>View Event</Link>
                            </div>

                        ))}
                    </div> 
                    : <div className="card p-8 text-center"><p className="text-muted">You haven&apos;t created any events</p></div>}

                </div>
            </div>
        </div>
    )
}
import { notFound } from "next/navigation";
import type { Event } from "@/lib/models";
import { auth } from "@/auth";
import EventActions from "@/components/EventActions";
import { format } from "date-fns";
import RSVPButtons from "@/components/RSVPButtons";
import type {RVSPStatus} from "@/lib/models"
import Image from "next/image";
export default async function EventPage({params}: {params: Promise<{eventId: string}>}) {
    const session = await auth()
    const {eventId} = await params;
    const eventResponse = await fetch(`http://localhost:3000/api/events/${eventId}`, {next: {tags: ["events"]}});
    if (!eventResponse.ok) {
        notFound()
    }
    const event = await eventResponse.json() as Event;
    const isOwner = session?.user?.id === event.userId;
    const isPast = new Date(event.date) < new Date();
    let currentRSVP: RVSPStatus | undefined; 
    if (session?.user?.id) {
        const rsvps = event.rsvps ?? [];
        const userRSVP  = rsvps.find((rsvp) => rsvp.userId === session?.user?.id );
        currentRSVP = userRSVP?.status;
        console.log(currentRSVP);
    }
    const goingRSVPs = event.rsvps.filter(({status}) => status == 'GOING');
    const maybeRSVPs = event.rsvps.filter(({status}) => status == 'MAYBE');
    const notGoingRSVPs = event.rsvps.filter(({status}) => status == 'NOT_GOING');
    console.log(notGoingRSVPs);
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Event Header */}
            <div className="card p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-4" >Event {event.title}</h1>
                        <p className="text-xl text-muted mb-6">{event.description}</p>
                    </div>
                    {
                        isOwner && 

                        <EventActions eventId={eventId} isOwner={isOwner} />
                    }

                </div>
                <div className="grid md:grid-cols-2 text-primary">
                    <div className="space-y-4 flex items-center gap-4">
                        <Image width={20} height={20} className="block" src="/assets/calendar.svg" alt="Calendar" />
                        <div className="font-medium text-foreground">
                            <p>
                                {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
                            </p>
                            <p className="text-muted">
                                {format(new Date(event.date), "h:m a")}
                            </p>
                        </div>
                    </div>
                </div>
                <div >
                    <div className="flex items-center gap-4 font-medium text-foreground">
                        <Image width={20} height={20}  className="block w-8 h-8" src="/assets/location.svg" alt="Location" />
                        <p>
                            {event.location}
                        </p>
                    </div>
                </div>
                <div >
                    <div className="flex items-center gap-4 font-medium text-foreground">
                        <Image width={20} height={20} className="block w-8 h-8" src="/assets/people.svg" alt="Location" />
                        <p>
                            Organized by {event.user.name || event.user.email}
                        </p>
                    </div>
                </div>
                <div >
                    <div className="flex items-center gap-4 font-medium text-foreground">
                        <Image width={20} height={20} className="block w-8 h-8" src="/assets/users.svg" alt="Location" />
                        <p>
                           {event._count.rsvps}  attending / {event.maxAttendees} max
                        </p>
                    </div>
                </div>
                {
                    !isPast && event.isPublic && (
                        <RSVPButtons eventId={event.id} currentRSVP={currentRSVP} />
                    )
                }
                {isPast && (
                    <div className="text-center p-4">
                        <p className="text-muted">This event has already passed</p>
                    </div>
                )}
                {
                    !event.isPublic && (
                        <div className="text-center p-4">
                            <p className="text-muted">This is a private event </p>
                        </div>
                    )
                }
            </div>
            {
                event.isPublic && 
                event.rsvps.length > 0 &&
                (
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Attendees</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {
                                goingRSVPs.length > 0 && 
                                (
                                   <div>
                                        <h3 className="text-lg font-semibold  text-green-400 mb-3">Going ({goingRSVPs.length})</h3>
                                        <div className="space-y-2">
                                            {goingRSVPs.map((rsvp, key:number) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full">
                                                    </div>

                                                    <span className="text-foreground">{rsvp.user.name}</span>

                                                </div>
                                            ))}
                                        </div>
                                   </div>
                                )
                            }
                            {
                                maybeRSVPs.length > 0 && 
                                (
                                    <div className="mt-2">
                                            <h3 className="text-lg font-semibold  text-yellow-400 mb-3">Maybe ({maybeRSVPs.length})</h3>
                                            <div className="space-y-2">
                                                {maybeRSVPs.map((rsvp, key) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full">
                                                        </div>

                                                        <span className="text-foreground">{rsvp.user.name}</span>

                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                )
                            }
                            {
                                notGoingRSVPs.length > 0 &&

                                <div className="mt-2">
                                            <h3 className="text-lg font-semibold  text-red-400 mb-3">Not Going {notGoingRSVPs.length}</h3>
                                            <div className="space-y-2">
                                                {notGoingRSVPs.map((rsvp, key) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-red-400 rounded-full">
                                                        </div>

                                                        <span className="text-foreground">{rsvp.user.name}</span>

                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
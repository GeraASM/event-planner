"use client";
import { useRouter } from "next/navigation"; // ✅ correcto para App Router
import { createEvent } from "@/lib/event-actions";
import { useActionState } from "react";

export default function CreateEventPage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createEvent, {
        success: false,
        eventId: null,
        error: ""

    })

    if (state.success && state.eventId) {
        router.push(`/events/${state.eventId}`)
    }



    return (
        <div className="max-w-2xl mx-auto border">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
                <p className="text-muted mt-2">Fill out the form below to create your event</p>

            </div>
            <form className="space-y-6" action={formAction} noValidate>
                <div>
                    <label className="text-muted block text-sm font-medium mb-2" htmlFor="title">Event Title <small className="text-red-500">*</small></label>
                    <input className="input-field" type="text" name="title" id="title" required placeholder="Enter event title"/>
                </div>
                <div>
                    <label className="text-muted block text-sm font-medium mb-2" htmlFor="description">Description <small className="text-red-500">*</small></label>
                    <textarea className="input-field resize-none" rows={4} name="description" id="description" required placeholder="Enter description"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-muted block text-sm font-medium mb-2" htmlFor="date">Date <small className="text-red-500">*</small></label>
                        <input className="input-field" type="datetime-local" name="date" id="date" required/>
                    </div>
                    <div>
                        <label className="text-muted block text-sm font-medium mb-2" htmlFor="location">Location <small className="text-red-500">*</small></label>
                        <input className="input-field" type="text" name="location" id="location" required placeholder="Enter location"/>
                    </div>

                </div>
                <div>
                        <label className="text-muted block text-sm font-medium mb-2" htmlFor="maxAttendees">Maximum Attendees <small className="text-red-500">*</small></label>
                        <input className="input-field" type="number" min="1" name="maxAttendees"  id="maxAttendees" required placeholder="Leave empty for unlimited"/>
                    </div>
                <div>
                    <p className="text-muted block text-sm font-medium mb-2">Event Visibility <small className="text-red-500">*</small></p>
                    <div className="flex items-center gap-2">
                        <input className="text-sm block h-4 w-4 border-slate-600 checked:accent-amber-200 focus:ring-primary" type="checkbox" name="isPublic"  id="isPublic" required/>
                        <label className="text-muted block text-sm font-medium " htmlFor="isPublic">Make this event public</label>

                    </div>
                </div>
                {
                    state.error && (
                        <div className="bg-red-600/10 border-red-600/20 border p-4 rounded-4">
                            <p className="text-sm text-red-400">Not authenticated</p>
                        </div>
                    )
                }

                <div className="flex justify-between">
                    <button className="btn-cancel" type="reset" disabled={isPending} onClick={() => router.back()}>Cancel</button>
                    <button className="btn-submit" type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Event"}</button>
                </div>
            </form>
        </div>
    )

}
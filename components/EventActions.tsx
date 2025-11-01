"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/lib/event-actions";
interface EventActionsProps {
    eventId: string;
    isOwner: boolean;

}
export default function EventActions({eventId}: EventActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this event? This action cannot restore")) {
            try {
                setIsDeleting(true);
                console.log("Run")
                const result = await deleteEvent(eventId);
                if ( result?.success) {
                    router.push(`/events`)
                }
                // await new Promise((resolve) => setTimeout(resolve, 2000))

                setIsDeleting(false);
            } catch (error) {
                console.log("Error while deleting the event", error)
                alert("Ah error occured while deleting the event")
            } finally {
                setIsDeleting(false);
            }

        } else {
            setIsDeleting(false);
            return
        }
    }
    return (
        <div className="flex gap-3">
            <button className="btn-secondary min-w-[130px] disabled:bg-gray-500" disabled={isDeleting} onClick={() => router.push(`/events/${eventId}/edit`)}>Edit Event</button>
            <button className="btn-danger disabled:bg-gray-500 min-w-[130px]"  onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting ..." : "Delete Event"}</button>
        </div>
    )
}
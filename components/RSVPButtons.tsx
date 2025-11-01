"use client";

import { useState } from "react";
import { rsvpToEvent } from "@/lib/event-actions";
import type { RVSPStatus } from "@/lib/models";
interface RSVPButtonsProps {


    eventId: string;
    currentRSVP?: RVSPStatus | undefined;
}

export default function  RSVPButtons({eventId, currentRSVP}: RSVPButtonsProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const baseClass = "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
    function getButtonClass(status: RVSPStatus) {
        const isActive = currentRSVP === status;
        switch (status) {
            case "GOING": {
                return `${baseClass} ${isActive ? "bg-green-600 text-white" : "bg-green-600/05 text-green-400"}   hover:bg-green-600/10`;
            }
            case "NOT_GOING": {
                return `${baseClass} ${isActive ? "bg-red-600 text-white" : "bg-red-600/05 text-red-400"}  hover:bg-red-600/10`;
            }
            case "MAYBE": {
                return `${baseClass} ${isActive ? "bg-yellow-600 text-white" : "bg-yellow-600/05 text-yellow-400"}  hover:bg-yellow-600/10`;
            }
            default: return baseClass;
        }
        
    }

    async function handleRSVP(status: RVSPStatus) {
        setIsLoading(true);
        try {
            const result = await rsvpToEvent(eventId, status);
            if (!result.success) {
                console.error(result.error);
            }
        } catch(error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">RSVP this event</h3>
            <div className="flex flex-wrap gap-3">
                <button disabled={isLoading} onClick={() => handleRSVP("GOING")} className={getButtonClass("GOING")}>GOING</button>
                <button disabled={isLoading} onClick={() => handleRSVP("NOT_GOING")} className={getButtonClass("NOT_GOING")}>NOT GOING</button>
                <button disabled={isLoading} onClick={() => handleRSVP("MAYBE")} className={getButtonClass("MAYBE")}>MAYBE</button>
            </div>
        </div>
    )
}
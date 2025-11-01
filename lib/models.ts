export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    isPublic: boolean;
    maxAttendees: number | null;
    userId: string;
    user: User;
    rsvps: EventRSVP[];
    _count: {
        rsvps: number
    }
}

export interface EventRSVP {
    userId: string;
    status: RVSPStatus;
    user: User;
}
interface User {
    name: string | null,
    email: string | null
}

export type RVSPStatus = "GOING" | "NOT_GOING" | "MAYBE";
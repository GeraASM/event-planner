"use server";

import { auth } from "@/auth";
import { z, ZodError } from "zod";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import type {RVSPStatus} from "@/lib/models";
export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    isPublic: boolean;
    maxAttendees: number | null;
    userId: string;

}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.string().optional(),
  isPublic: z.union([z.literal("on"), z.literal("true")]).optional(), // si usas checkbox
});

interface EventActionState {
  success: boolean;
  error: string;
  eventId: string | null;
}

export async function createEvent(_prevState: EventActionState, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Not authenticated",  eventId: null };
    }

    const rawData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      maxAttendees: formData.get("maxAttendees")?.toString() || null,
      isPublic: formData.get("isPublic")?.toString(),         // aquí recibe un "on"
    };

   
    const validatedData = eventSchema.parse(rawData);

    const event = await prisma.event.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          date: new Date(validatedData.date),
          location: validatedData.location,
          maxAttendees: validatedData.maxAttendees
            ? Number(validatedData.maxAttendees)
            : null,
          isPublic: validatedData.isPublic === "on" || validatedData.isPublic === "true",
          userId: session!.user!.id!, // ✅ Now definitely a string
        },
      });

    return { success: true, eventId: event.id, error: "" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        eventId: null,
        error: "Validation failed",
      };
    }
    console.error("Error creating event:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      eventId: null
    };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated"
      }
    }
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId
      },
    });
    if (!existingEvent) {
      return {succes: false, error: "Not authenticated"};
    }
    if (existingEvent.userId !== session.user.id) {
      return {success: false, error: "Not authorized to delete this event"}
    }

    await prisma.event.delete({
      where: {id: eventId}
    })
    revalidateTag("events")
    return {success: true}
  } catch(error) {
    console.log(error);
    return {succes: false, error: "Failed to delete event"};
  }

}

export async function rsvpToEvent(eventId: string, status: RVSPStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated",  eventId: null };
    }
     
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId
      },
    });
    if (!existingEvent) {
      return {succes: false, error: "Event not found"};
    }

    if (!existingEvent.isPublic) {
      return ({success: false, error: "Event is not public"});
    }

  // if (existingEvent.userId == session.user.id) {
  //   return {success: false, error: "You cannot RSVP to this event"}
  // }

    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        }
      }
    })
    if (existingRSVP) {
      await prisma.rSVP.update({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId
          }
        },
        data: { status }

      })
    } else {
      await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          eventId,
          status
        }
      })
    }
    revalidateTag("events");
    revalidateTag(`event-${eventId}`);
    revalidateTag(`rsvps`);
    return {success: true}
  } catch (error) {
    return {success: false, error: "Failed to RSVP"}
  }
}
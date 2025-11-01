import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
    const session = await auth();
       console.log("Here request", session?.user?.id)
        // if (!session?.user?.id) {
        //     return NextResponse.json({error: "Not authenticated", status: 401})
        // }
        const userEvents = await prisma.event.findMany({
            where: {userId: session?.user?.id},
            include: {
                _count: {
                    select: {rsvps: true}
                }
            },
            orderBy: {date: "asc"}
        });
        return NextResponse.json(userEvents);

    } catch(error) {
        return NextResponse.json({error: "Failed to fetch user events", status: 500})
    }
}
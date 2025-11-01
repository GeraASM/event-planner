import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(requiest: NextRequest) {
    try {
        const {searchParams} = new URL(requiest.url);
        const search = searchParams.get("search");
        const filter = searchParams.get("filter");
        const where: any = {};
        if (search) {
            where.OR = [
                {title: {contains: search, mode: "insensitive" }},
                {description: {contains: search, mode: "insensitive" }},
                {location: {contains: search, mode: "insensitive"}}


            ]

        }
        if (filter === 'Past') {
            where.date = {lt: new Date()}
        } else if (filter === 'Upcoming') {
            where.date = {gte: new Date()}

        }
        const events = await prisma.event.findMany({
            where: where,
            include: {user: {select: {name: true, email: true}},
                    rsvps: { include: {
                        user: {
                            select: {name: true, email: true}
                        }
                    }},
                    _count: {
                        select: {rsvps: true}
                    }    
            }, 
            orderBy: {date: "asc"}
        });
        return NextResponse.json(events)
    } catch(error) {
        return NextResponse.json({error: "Failed to fetch events", status: 500})
    }
}
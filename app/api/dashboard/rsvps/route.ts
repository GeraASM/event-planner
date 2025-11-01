import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
    const session = await auth();
       console.log("Here request", session?.user?.id)
        // if (!session?.user?.id) {
        //     return NextResponse.json({error: "Not authenticated", status: 401})
        // }
        const userRSVPs = await prisma.rSVP.findMany({
            where: {userId: session?.user?.id},
            include: {
                event: {
                    include: {
                        user: {
                            select: { name: true}
                        }
                    }
                }
            },
            orderBy: {event: {date: "asc"}}
           
        });
        return NextResponse.json(userRSVPs);

    } catch(error) {
         console.error("Failed to fetch rsvps:", error);
        return NextResponse.json({error: "Failed to fetch rsvps", status: 500})
    }
}
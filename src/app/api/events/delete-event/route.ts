import { NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/lib/db";
import getSession from "@/app/actions/get-session";

const formSchema = z.object({
    eventId: z.string(),
});

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { eventId } = formSchema.parse(body);

        if (!eventId)
        return new NextResponse("Bad Request", { status: 400 })

        const session = await getSession();
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const currentUser = session.user;
        if (!currentUser.id)
        return new NextResponse("Unauthorized", { status: 401 });

        const deletedEvent = await db.calendarEvent.delete({
            where: {
                id: eventId
            }
        });

        if (!deletedEvent)
        return new NextResponse("Failed to delete event", { status: 500 });

        return NextResponse.json({ message: "Event deleted", event: deletedEvent }, { status: 201 });
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
}


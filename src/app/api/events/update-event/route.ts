export const runtime = 'edge'

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/app/actions/get-session";
import { eventFormSchema } from "@/app/(calendar)/calendar/_components/_util";

const formSchema = eventFormSchema;
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { eventId, title, startDate, startTime, endTime, repeat, color, label } = formSchema.parse(body);

        if (!eventId || !title || !startDate || !startTime || !endTime || !repeat || !color || !label)
        return new NextResponse("Bad Request", { status: 400 })

        const session = await getSession();
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const currentUser = session.user;
        if (!currentUser.id)
        return new NextResponse("Unauthorized", { status: 401 });

        const updatedEvent = await db.calendarEvent.update({
            where: {
                id: eventId
            },
            data: {
                title,
                startDate,
                startTime,
                endTime,
                repeat,
                color,
                label,
                user: { connect: { id: currentUser.id }}
            },
        });

        if (!updatedEvent)
        return new NextResponse("Failed to update event", { status: 500 });

        return NextResponse.json({ message: "Event updated", event: updatedEvent }, { status: 201 });
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
}


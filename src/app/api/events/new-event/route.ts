export const runtime = 'edge'

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/app/actions/get-session";
import { eventFormSchema } from "@/app/(calendar)/calendar/_components/_util";

const formSchema = eventFormSchema;
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, startDate, startTime, endTime, repeat, color, label } = formSchema.parse(body);

        if (!title || !startDate || !startTime || !endTime || !repeat || !color || !label)
        return new NextResponse("Bad Request", { status: 400 })

        const session = await getSession();
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const currentUser = session.user;
        if (!currentUser.id)
        return new NextResponse("Unauthorized", { status: 401 });

        const newEvent = await db.calendarEvent.create({
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

        if (!newEvent)
        return new NextResponse("Failed to create event", { status: 500 });

        return NextResponse.json({ message: "New event created", event: newEvent }, { status: 201 });
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
}


import React from "react";
import CalendarView from "./_components/calendar-view";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import getEvents from "@/app/actions/get-events";

export default async function Calendar() {
    const events = await getEvents();

    return (
        <ScrollArea className="grow basis-0">
            <main className="max-h-[calc(100vh-64px)]">
                <CalendarView events={events} />
            </main>
            <ScrollBar orientation="horizontal" />
            <ScrollBar />
        </ScrollArea>
    )
}

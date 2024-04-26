import React from "react";
import CalendarView from "./_components/calendar-view";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import getEvents from "@/app/actions/get-events";

export default async function Calendar() {
    const events = await getEvents();

    return (
            <main>
                <ScrollArea className="grow basis-0">
                    <CalendarView events={events} />
                    <ScrollBar />
                <ScrollBar className="!fixed bottom-0" style={{ position: "fixed" }} orientation="horizontal" />
                </ScrollArea>
            </main>
    )
}

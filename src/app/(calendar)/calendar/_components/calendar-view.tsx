"use client";
import { useSelectedView, views } from "@/context/selected-view-context";
import React from "react";
import { getWeek, isToday, parse, setMinutes } from "date-fns";
import { layouts, useSelectedLayout } from "@/context/selected-layout-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVisibleDate } from "@/context/visible-date-context";
import NewEventDialog from "./new-event-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CalendarEvent } from "@prisma/client";
import { formatDate, formatHour, generateCalendarGrid, getVisibleEvents, getWeekDays, hours } from "./_util";
import EditEventDialog from "./edit-event-dialog";

export type DateTime = {
    date: Date,
    hour: number,
}

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
    const { selectedView } = useSelectedView();
    const { selectedLayout } = useSelectedLayout();
    const { visibleDate } = useVisibleDate();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime | null>(null);
    const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
    const [newEventDialogOpen, setNewEventDialogOpen] = React.useState(false);
    const [editEventDialogOpen, setEditEventDialogOpen] = React.useState(false);

    const handleButtonClick = (day: Date, hour: number) => {
        setSelectedDateTime({ date: day, hour });
        setNewEventDialogOpen(true);
    };
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setEditEventDialogOpen(true);
    }

    const currentWeekNumber = getWeek(visibleDate);
    return (
        <>
            <div className={cn("pt-16", isDesktop && "pl-16")}>
                {selectedView === views[0] // day view
                    ? <div className="flex h-full flex-col">
                        <div className="border-b bg-muted py-2">
                            <div className="flex z-10 shrink-0 flex-col items-center justify-center text-sm text-muted-foreground relative">
                                <span className="font-mono">{formatDate(visibleDate).day}</span>
                                <span className="font-serif text-2xl font-black text-primary/80">{formatDate(visibleDate).dayNumber}</span>
                                <div className={cn(isToday(visibleDate) && "-z-10 rounded-full w-16 h-16 bg-background/80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")} />
                            </div>
                        </div>
                        <div className="relative">
                            {hours.map(hour => (
                                <Button
                                    key={hour}
                                    className={cn("w-full relative justify-start shrink-0 rounded-none border-b !bg-transparent !shadow-none transition-[height] duration-200", selectedLayout === layouts[0] ? "h-20 max-h-20" : "h-40 max-h-40")}
                                    onClick={() => handleButtonClick(setMinutes(visibleDate, 0), hour)}
                                >
                                    <div className="flex w-full max-w-10 shrink-0 items-center justify-between gap-1 text-sm text-muted-foreground">
                                        <span className="ml-auto">{formatHour(hour, visibleDate).time}</span>
                                        <span>{formatHour(hour, visibleDate).meridiem}</span>
                                    </div>
                                </Button>
                            ))}
                            {getVisibleEvents(events, visibleDate).map((event, idx) => {
                                const startTime = parse(event.startTime, 'hh:mm a', new Date());
                                const endTime = parse(event.endTime, 'hh:mm a', new Date());

                                const HOUR_SIZE_PX = selectedLayout === layouts[0] ? 80 : 160;
                                const MINUTE_SIZE_PX = HOUR_SIZE_PX / 60;

                                const startHour = startTime.getHours();
                                const startMinutes = startTime.getMinutes();
                                const endHour = endTime.getHours();
                                const endMinutes = endTime.getMinutes();

                                const durationMinutes = (endHour - startHour) * 60 + (endMinutes - startMinutes);

                                const topValue = (startHour * HOUR_SIZE_PX) + (startMinutes * MINUTE_SIZE_PX);
                                const heightValue = durationMinutes * MINUTE_SIZE_PX;

                                return (
                                    <Button onClick={() => handleEventClick(event)} key={idx} className={cn("left-[72px] p-1 absolute text-primary transition-[height] duration-200 w-[calc(100%-72px)] justify-start !bg-transparent !shadow-none", selectedLayout === layouts[0] ? "h-20" : "h-40")} style={{ top: `${topValue}px`, height: `${heightValue}px` }}>
                                        <div className="rounded-md h-full text-primary flex flex-col gap-0 min-w-full overflow-hidden p-2 text-left" style={{backgroundColor: event.color}}>
                                            <span className="font-semibold leading-none">{event.title}</span>
                                            <span>{event.startTime} &mdash; {event.endTime}</span>
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    : selectedView === views[1] // week view
                        ? <div className="flex min-h-full max-w-full">
                            <div className="flex shrink flex-col w-14 items-center text-sm text-muted-foreground">
                                <div className="w-full h-[69px] max-h-[69px] border-b border-r bg-muted py-2 px-4 grid place-items-center">
                                    <span className="font-mono text-muted-foreground">W{currentWeekNumber}</span>
                                </div>

                                {hours.map(hour => (
                                    <div key={hour} className={cn("flex w-full shrink-0 animate-[height] items-center gap-4 pr-3 border-b border-r duration-200", selectedLayout === layouts[0] ? "h-20" : "h-40")}>
                                        <div className="flex w-full shrink-0 items-center justify-between gap-1 text-xs text-muted-foreground">
                                            <span className="ml-auto">{formatHour(hour, visibleDate).time}</span>
                                            <span>{formatHour(hour, visibleDate).meridiem}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex grow flex-row">
                                {getWeekDays(visibleDate).map((day, index) => (
                                    <div key={index} className={cn("flex shrink-0 animate-[width] items-start gap-4 border-r duration-200 last:border-r-0 relative", selectedLayout === layouts[0] ? "w-px grow" : "w-[25%]")}>
                                        <div className="flex w-full shrink-0 flex-col items-center justify-center">
                                            <div className="flex w-full flex-col items-center justify-center border-b bg-muted py-2 text-sm text-muted-foreground relative">
                                                <span className="font-mono z-20">{formatDate(day).day}</span>
                                                <span className="font-serif z-20 text-2xl font-black text-primary/80">{formatDate(day).dayNumber}</span>
                                                <div className={cn(isToday(day) && "z-10 rounded-full w-16 h-16 bg-background/80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")} />
                                            </div>
                                            {hours.map(hour => (
                                                <Button
                                                    key={hour}
                                                    onClick={() => handleButtonClick(day, hour)}
                                                    className={cn("w-full rounded-none border-b !bg-transparent !shadow-none animate-[width,height] duration-200", selectedLayout === layouts[0] ? "h-20" : "h-40")}
                                                >
                                                </Button>
                                            ))}
                                        </div>
                                        {getVisibleEvents(events, day).map((event, idx) => {
                                            const startTime = parse(event.startTime, 'hh:mm a', new Date());
                                            const endTime = parse(event.endTime, 'hh:mm a', new Date());

                                            const HOUR_SIZE_PX = selectedLayout === layouts[0] ? 80 : 160;
                                            const MINUTE_SIZE_PX = HOUR_SIZE_PX / 60;

                                            const startHour = startTime.getHours();
                                            const startMinutes = startTime.getMinutes();
                                            const endHour = endTime.getHours();
                                            const endMinutes = endTime.getMinutes();

                                            const durationMinutes = (endHour - startHour) * 60 + (endMinutes - startMinutes);

                                            const topValue = (startHour * HOUR_SIZE_PX) + (startMinutes * MINUTE_SIZE_PX);
                                            const heightValue = durationMinutes * MINUTE_SIZE_PX;

                                            return (
                                                <Button onClick={() => handleEventClick(event)} key={idx} className={cn("p-1 mt-[69px] w-full absolute text-primary transition-[height] duration-200 justify-start !bg-transparent !shadow-none", selectedLayout === layouts[0] ? "h-20" : "h-40")} style={{ top: `${topValue}px`, height: `${heightValue}px` }}>
                                                    <div className="rounded-md h-full text-primary flex flex-col gap-0 min-w-full overflow-hidden p-2 text-left" style={{backgroundColor: event.color}}>
                                                        <span className="font-semibold leading-none">{event.title}</span>
                                                        <span>{event.startTime} &mdash; {event.endTime}</span>
                                                    </div>
                                                </Button>
                                            );
                                        })}
                                    </div>

                                ))}
                            </div>
                        </div>
                        : <div className="h-[calc(100vh-64px)]"> {/* month view */}
                            <div className={cn("flex", selectedLayout === layouts[0] ? "h-full w-full" : "h-[125%] w-[125%]")}>
                                <div className="grow grid grid-rows-6 grid-cols-7">
                                    {generateCalendarGrid(visibleDate).map((day, idx) => (
                                        <div
                                            key={idx}
                                            className={cn("w-full space-y-1 rounded-none border-[0.5px] animate-[width,height] duration-200 h-full",
                                                day.isThisMonth ? "bg-transparent" : "bg-muted",
                                                idx === 0 ? "border-t-0 border-l-0" : idx % 7 === 0 ? "border-l-0" : Math.floor(idx / 7) === 0 ? "border-t-0" : "",
                                            )}>
                                            <div className="flex w-full flex-col items-center justify-center text-xs text-muted-foreground py-1">
                                                <span className="font-mono">{formatDate(day.date).day}</span>
                                                <span className="font-serif text-base leading-none font-black text-primary/80">{formatDate(day.date).dayNumber}</span>
                                            </div>
                                            {getVisibleEvents(events, day.date).map((event, idx) => {
                                                if (!day.isThisMonth) return null
                                            return (
                                                <Button variant="ghost" onClick={() => handleEventClick(event)} key={idx} className="p-1 px-2.5 h-fit w-full text-primary justify-start !shadow-none">
                                                    <div className="rounded-md h-full text-primary flex gap-2 min-w-full overflow-hidden items-center text-left">
                                                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                                                        <span className="font-semibold leading-none text-sm truncate">{event.title}</span>
                                                    </div>
                                                </Button>
                                            );
                                        })}

                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                }
            </div>
            {selectedDateTime && newEventDialogOpen && <NewEventDialog open={newEventDialogOpen} setOpen={setNewEventDialogOpen} selectedDateTime={selectedDateTime} />}
            {selectedEvent && editEventDialogOpen && <EditEventDialog open={editEventDialogOpen} setOpen={setEditEventDialogOpen} selectedEvent={selectedEvent} />}
        </>
    )
}


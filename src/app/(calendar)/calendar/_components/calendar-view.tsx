"use client";
import { useSelectedView, views } from "@/context/selected-view-context";
import React from "react";
import { addDays, differenceInDays, endOfMonth, format, getDate, getWeek, isToday, setMinutes, startOfMonth, startOfWeek, subDays } from "date-fns";
import { layouts, useSelectedLayout } from "@/context/selected-layout-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVisibleDate } from "@/context/visible-date-context";
import NewEventDialog from "./new-event-dialog";

export type DateTime = {
    date: Date,
    hour: number,
}

// TODO: Compenentize this mess

export default function CalendarView() {
    const { selectedView } = useSelectedView();
    const { selectedLayout } = useSelectedLayout();
    const { visibleDate } = useVisibleDate();

    const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime | null>(null);
    const [eventDialogOpen, setEventDialogOpen] = React.useState<boolean>(false);
    const handleButtonClick = (day: Date, hour: number) => {
        setSelectedDateTime({ date: day, hour });
        setEventDialogOpen(true);
    };

    const startOfWeekDate = startOfWeek(visibleDate);
    const currentWeekNumber = getWeek(visibleDate);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    function formatHour(hour: number) {
        const hourDate = new Date(visibleDate);
        hourDate.setHours(hour, 0, 0, 0);
        const formattedHour = format(hourDate, "h a");
        const [time, meridiem] = formattedHour.split(' ');
        return { time: time.replace(/^0/, ''), meridiem };
    }

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));
    function formatDate(date: Date) {
        const formattedDate = format(date, "EEE d");
        const [day, dayNumber] = formattedDate.split(' ');
        return { day, dayNumber };
    };

    function generateCalendarGrid(currentDate: Date) {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDay = getDate(monthStart);
        const endDay = getDate(monthEnd);
        const daysInMonth = endDay - startDay + 1;

        const firstDayOfWeek = startOfWeek(monthStart);
        const daysToSubtract = differenceInDays(monthStart, firstDayOfWeek);
        const adjustedMonthStart = subDays(monthStart, daysToSubtract % 7);
        const daysInPrevMonth = daysToSubtract;
        const daysInNextMonth = 42 - daysInMonth - daysInPrevMonth; // 42 cells in a 6x7 grid

        let days = [];
        for (let i = 0; i < daysInPrevMonth; i++) {
            days.push({ date: addDays(adjustedMonthStart, 0 - i), isThisMonth: false });
        }
        for (let i = 0; i < daysInMonth; i++) {
            days.push({ date: addDays(monthStart, i), isThisMonth: true });
        }
        for (let i = 0; i < daysInNextMonth; i++) {
            days.push({ date: addDays(monthEnd, i + 1), isThisMonth: false });
        }

        return days;
    }

    return (
        <>
            {selectedView === views[0] // day view
                ? <div className="flex h-full flex-col">
                    <div className="border-b bg-muted py-2">
                        <div className="flex z-10 shrink-0 flex-col items-center justify-center text-sm text-muted-foreground relative">
                            <span className="font-mono">{formatDate(visibleDate).day}</span>
                            <span className="font-serif text-2xl font-black text-primary/80">{formatDate(visibleDate).dayNumber}</span>
                            <div className={cn(isToday(visibleDate) && "-z-10 rounded-full w-16 h-16 bg-background/80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")} />
                        </div>
                    </div>
                    {hours.map(hour => (
                        <Button
                            key={hour}
                            className={cn("w-full justify-start shrink-0 rounded-none border-b !bg-transparent !shadow-none transition-[height] duration-200", selectedLayout === layouts[0] ? "h-20" : "h-40")}
                            onClick={() => handleButtonClick(setMinutes(visibleDate, 0), hour)}
                        >
                            <div className="flex w-full max-w-[72px] shrink-0 items-center justify-between gap-1 pr-2 text-sm text-muted-foreground">
                                <span className="ml-auto">{formatHour(hour).time}</span>
                                <span>{formatHour(hour).meridiem}</span>
                            </div>
                        </Button>
                    ))}
                </div>
                : selectedView === views[1] // week view
                    ? <div className="flex min-h-full max-w-full">
                        <div className="flex shrink flex-col items-center text-sm text-muted-foreground">
                            <div className="w-full h-[69px] max-h-[69px] border-b border-r bg-muted py-2 px-4 grid place-items-center">
                                <span className="font-mono text-muted-foreground">W{currentWeekNumber}</span>
                            </div>

                            {hours.map(hour => (
                                <div key={hour} className={cn("flex w-full shrink-0 animate-[height] items-center gap-4 pr-3 border-b border-r duration-200", selectedLayout === layouts[0] ? "h-20" : "h-40")}>
                                    <div className="flex w-full shrink-0 items-center justify-between gap-1 text-xs text-muted-foreground">
                                        <span className="ml-auto">{formatHour(hour).time}</span>
                                        <span>{formatHour(hour).meridiem}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex grow flex-row">
                            {weekDays.map((day, index) => (
                                <div key={index} className={cn("flex shrink-0 animate-[width] items-start gap-4 border-r duration-200 last:border-r-0", selectedLayout === layouts[0] ? "w-px grow" : "w-[25%]")}>
                                    <div className="flex w-full shrink-0 flex-col items-center justify-center">
                                        <div className="z-10 flex w-full flex-col items-center justify-center border-b bg-muted py-2 text-sm text-muted-foreground relative">
                                            <span className="font-mono">{formatDate(day).day}</span>
                                            <span className="font-serif text-2xl font-black text-primary/80">{formatDate(day).dayNumber}</span>
                                            <div className={cn(isToday(day) && "-z-10 rounded-full w-16 h-16 bg-background/80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")} />
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
                                </div>
                            ))}

                        </div>
                    </div>
                    : <> {/* month view */}
                        <div className="flex min-h-full max-w-full">
                            <div className="grow grid grid-rows-6 grid-cols-7">
                                {generateCalendarGrid(visibleDate).map((day, idx) => (
                                    <div key={idx} className={cn("w-full rounded-none border-[0.5px] animate-[width,height] duration-200 h-full", day.isThisMonth ? "bg-transparent" : "bg-muted", idx === 0 ? "border-t-0 border-l-0" : idx % 7 === 0 ? "border-l-0" : Math.floor(idx / 7) === 0 ? "border-t-0" : "")}>
                                        <div className="flex w-full flex-col items-center justify-center text-xs text-muted-foreground py-1">
                                            <span className="font-mono">{formatDate(day.date).day}</span>
                                            <span className="font-serif text-base leading-none font-black text-primary/80">{formatDate(day.date).dayNumber}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </>
            }
            {selectedDateTime && eventDialogOpen && <NewEventDialog open={eventDialogOpen} setOpen={setEventDialogOpen} selectedDateTime={selectedDateTime} />}
        </>
    )
}


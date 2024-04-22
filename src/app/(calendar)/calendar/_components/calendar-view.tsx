"use client";
import { useSelectedView, views } from "@/context/selected-view-context";
import React from "react";
import { addDays, format, getWeek, startOfWeek } from "date-fns";
import { layouts, useSelectedLayout } from "@/context/selected-layout-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

export default function CalendarView() {
    const { selectedView } = useSelectedView();
    const { selectedLayout } = useSelectedLayout();
    const currentDate = new Date();

    const hours = Array.from({ length: 24 }, (_, i) => i);
    function formatHour(hour: number) {
        const hourDate = new Date(currentDate);
        hourDate.setHours(hour, 0, 0, 0);
        const formattedHour = format(hourDate, "h a");
        const [time, meridiem] = formattedHour.split(' ');
        return { time: time.replace(/^0/, ''), meridiem };
    }

    const startOfWeekDate = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));
    const currentWeekNumber = getWeek(currentDate);

    function formatDate(date: Date) {
        const formattedDate = format(date, "EEE d");
        const [month, day] = formattedDate.split(' ');
        return { month, day };
    };

    return selectedView === views[0] // day view
        ? <div className="flex h-full flex-col">
            <div className="flex w-full items-center justify-center gap-4 border-b bg-muted py-2">
                <Button variant="ghost" size="icon" className="!bg-transparent text-muted-foreground !shadow-none hover:text-foreground">
                    <CaretLeftIcon className="h-5 w-5" />
                </Button>
                <div className="flex shrink-0 flex-col items-center justify-center gap-px text-sm text-muted-foreground">
                    <span className="font-mono">{formatDate(currentDate).month}</span>
                    <span className="font-serif text-2xl font-black text-primary/80">{formatDate(currentDate).day}</span>
                </div>
                <Button variant="ghost" size="icon" className="!bg-transparent text-muted-foreground !shadow-none hover:text-foreground">
                    <CaretRightIcon className="h-5 w-5" />
                </Button>
            </div>
            {hours.map(hour => (
                <div key={hour} className={cn("flex shrink-0 animate-[height] items-center gap-4 border-b duration-300", selectedLayout === layouts[0] ? "h-20" : "h-40")}>
                    <div className="flex w-full max-w-[72px] shrink-0 items-center justify-between gap-1 pr-2 text-sm text-muted-foreground">
                        <span className="ml-auto">{formatHour(hour).time}</span>
                        <span>{formatHour(hour).meridiem}</span>
                    </div>
                </div>
            ))}
        </div>
        : selectedView === views[1] // week view
            ? <div className="flex min-h-full max-w-full">
                <div className="flex shrink flex-col items-center text-sm text-muted-foreground">
                    <div className="flex h-[70px] max-h-[70px] flex-col items-center gap-px border-b border-r bg-muted py-2">
                        <span className="font-mono text-muted-foreground">W{currentWeekNumber}</span>
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="icon" className="!bg-transparent text-muted-foreground !shadow-none hover:text-foreground">
                                <CaretLeftIcon className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="!bg-transparent text-muted-foreground !shadow-none hover:text-foreground">
                                <CaretRightIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {hours.map(hour => (
                        <div key={hour} className={cn("flex w-full shrink-0 animate-[height] items-center gap-4 pr-4 border-b border-r duration-300", selectedLayout === layouts[0] ? "h-20" : "h-40")}>
                            <div className="flex w-full shrink-0 items-center justify-between gap-1 text-xs text-muted-foreground">
                                <span className="ml-auto">{formatHour(hour).time}</span>
                                <span>{formatHour(hour).meridiem}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex grow flex-row">
                    {weekDays.map((day, index) => (
                        <div key={index} className={cn("flex shrink-0 animate-[width] items-start gap-4 border-r duration-300 last:border-r-0", selectedLayout === layouts[0] ? "w-px grow" : "w-[25%]")}>
                            <div className="flex w-full shrink-0 flex-col items-center justify-center">
                                <div className="flex w-full flex-col items-center justify-center gap-px border-b bg-muted py-2 text-sm text-muted-foreground">
                                    <span className="font-mono">{formatDate(day).month}</span>
                                    <span className="font-serif text-2xl font-black text-primary/80">{formatDate(day).day}</span>
                                </div>
                                {hours.map(hour => (
                                    <Button
                                        key={hour}
                                        onClick={() => alert(hour)}
                                        className={cn("w-full rounded-none border-b !bg-transparent !shadow-none animate-[width,height] duration-300", selectedLayout === layouts[0] ? "h-20" : "h-40")}
                                    >
                                        {`${formatHour(hour).time} ${formatHour(hour).meridiem}`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            : <> {/* month view */}
            </>
}


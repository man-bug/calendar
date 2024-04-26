import { View, views } from "@/context/selected-view-context";
import { CalendarEvent } from "@prisma/client";
import { addDays, differenceInDays, endOfMonth, endOfWeek, format, getDate, isSameDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import * as z from "zod";

export const eventFormSchema = z.object({
    eventId: z.string().optional(),
    title: z.string(),
    startDate: z.coerce.date(),
    startTime: z.string(),
    endTime: z.string(),
    repeat: z.string(),
    color: z.string(),
    label: z.string(),
});

export const hours = Array.from({ length: 24 }, (_, i) => i);
export function formatHour(hour: number, visibleDate: Date) {
    const hourDate = new Date(visibleDate);
    hourDate.setHours(hour, 0, 0, 0);
    const formattedHour = format(hourDate, "h a");
    const [time, meridiem] = formattedHour.split(' ');
    return { time: time.replace(/^0/, ''), meridiem };
}

export function getWeekDays(visibleDate: Date) {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(visibleDate), i));
}
export function formatDate(date: Date) {
    const formattedDate = format(date, "EEE d");
    const [day, dayNumber] = formattedDate.split(' ');
    return { day, dayNumber };
};

export function generateCalendarGrid(currentDate: Date) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDay = getDate(monthStart);
    const endDay = getDate(monthEnd);
    const daysInMonth = endDay - startDay + 1;

    const firstDayOfWeek = startOfWeek(monthStart);
    const daysToSubtract = differenceInDays(monthStart, firstDayOfWeek);
    const adjustedMonthStart = subDays(monthStart, daysToSubtract);
    const daysInPrevMonth = daysToSubtract;
    const daysInNextMonth = 42 - daysInMonth - daysInPrevMonth; // 42 cells in a 6x7 grid

    let days = [];
    for (let i = 0; i < daysInPrevMonth; i++) {
        days.push({ date: addDays(adjustedMonthStart, i), isThisMonth: false });
    }
    for (let i = 0; i < daysInMonth; i++) {
        days.push({ date: addDays(monthStart, i), isThisMonth: true });
    }
    for (let i = 0; i < daysInNextMonth; i++) {
        days.push({ date: addDays(monthEnd, i + 1), isThisMonth: false });
    }

    return days;
}

export function getVisibleEvents(events: CalendarEvent[], visibleDate: Date) {
    return events.filter(event => {
            if (event.repeat === "daily") {
                const daysSinceStart = differenceInDays(visibleDate, event.startDate);
                return daysSinceStart >= 0;
            }
            if (event.repeat === "weekly") {
                const daysSinceStart = differenceInDays(visibleDate, event.startDate);
                const visibleDayOfWeek = visibleDate.getDay();
                const eventStartDayOfWeek = event.startDate.getDay();
                return daysSinceStart >= 0 && visibleDayOfWeek === eventStartDayOfWeek;
            }
            if (event.repeat === "weekdays") {
                const daysSinceStart = differenceInDays(visibleDate, event.startDate);
                const visibleDayOfWeek = visibleDate.getDay();
                return daysSinceStart >= 0 && visibleDayOfWeek >= 1 && visibleDayOfWeek <= 5;
            }
            return isSameDay(event.startDate, visibleDate);
    });
}

export const repeatOptions = [
    {
        label: "Never",
        value: "never",
    },
    {
        label: "Daily",
        value: "daily",
    },
    {
        label: "Weekly",
        value: "weekly",
    },
    {
        label: "On weekdays",
        value: "weekdays",
    },
]

export const eventLabels = [
    {
        label: "None",
        value: "none",
    },
    {
        label: "Work",
        value: "work",
    },
    {
        label: "School",
        value: "school",
    },
    {
        label: "Personal",
        value: "personal",
    },
]

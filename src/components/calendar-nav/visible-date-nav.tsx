"use client";
import { useVisibleDate } from "@/context/visible-date-context";
import React from "react";
import { Button } from "../ui/button";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { addDays, addMonths, addWeeks, endOfWeek, formatDate, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { useSelectedView } from "@/context/selected-view-context";
import { views } from "@/context/selected-view-context";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import useDomLoaded from "@/hooks/use-dom-loaded";

export default function VisibleDateNav() {
    const { visibleDate, setVisibleDate } = useVisibleDate();
    const { selectedView } = useSelectedView();
    const loaded = useDomLoaded();

    function handleClick(type: "add" | "subtract") {
        switch (type) {
            case "add":
                switch (selectedView) {
                    case views[0]:
                        setVisibleDate(addDays(visibleDate, 1));
                        break;
                    case views[1]:
                        setVisibleDate(addWeeks(visibleDate, 1));
                        break;
                    case views[2]:
                        setVisibleDate(addMonths(visibleDate, 1));
                        break;
                    default:
                        break;
                }
                break;
            case "subtract":
                switch (selectedView) {
                    case views[0]:
                        setVisibleDate(subDays(visibleDate, 1));
                        break;
                    case views[1]:
                        setVisibleDate(subWeeks(visibleDate, 1));
                        break;
                    case views[2]:
                        setVisibleDate(subMonths(visibleDate, 1));
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    function getFormattedDate() {
        switch (selectedView) {
            case views[0]:
                return formatDate(visibleDate, "EEEE, MMM dd, y"); // day view (Wednesday, Apr 24, 2024)
            case views[1]:
                // week view (Apr 21 - Apr 27, 2024)
                const startWeek = startOfWeek(visibleDate);
                const endWeek = endOfWeek(visibleDate);
                return `${formatDate(startWeek, "MMMM dd")} — ${formatDate(endWeek, "MMMM dd, y")}`;
            case views[2]:
                return formatDate(visibleDate, "MMMM y"); // month view (March 2024)
            default:
                return "";
        }
    }

    if (loaded) {
        return (
            <div className="flex items-center">
                <Button onClick={() => handleClick("subtract")} variant="ghost" size="icon" className="text-muted-foreground !shadow-none hover:text-foreground">
                    <CaretLeftIcon className="h-5 w-5" />
                </Button>
                <Button onClick={() => handleClick("add")} variant="ghost" size="icon" className="text-muted-foreground !shadow-none hover:text-foreground">
                    <CaretRightIcon className="h-5 w-5" />
                </Button>
                <div className="flex z-10 ml-2 shrink-0 flex-col items-center justify-center text-sm text-muted-foreground">
                    <Badge variant="outline" className="w-fit text-muted-foreground">
                        {getFormattedDate()}
                    </Badge>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-[22px] w-9" />
        </div>
    )
}

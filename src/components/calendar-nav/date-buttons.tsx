"use client";
import { View, useSelectedView, views } from "@/context/selected-view-context";
import { useVisibleDate } from "@/context/visible-date-context";
import React from "react";
import { Button } from "../ui/button";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";

type Props = {
    type: "add" | "subtract",
    visibleDate: Date,
    setVisibleDate: React.Dispatch<React.SetStateAction<Date>>,
    selectedView: View,
}
function handleClick({ type, visibleDate, setVisibleDate, selectedView }: Props) {
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

export function SubtractDateBtn() {
    const { selectedView } = useSelectedView();
    const { visibleDate, setVisibleDate } = useVisibleDate();

    return (
        <Button onClick={() => handleClick({type: "subtract", visibleDate, setVisibleDate, selectedView})} variant="ghost" size="icon" className="text-muted-foreground !shadow-none hover:text-foreground">
            <CaretLeftIcon className="h-5 w-5" />
        </Button>
    )
}

export function AddDateBtn() {
    const { selectedView } = useSelectedView();
    const { visibleDate, setVisibleDate } = useVisibleDate();

    return (
        <Button onClick={() => handleClick({type: "add", visibleDate, setVisibleDate, selectedView})} variant="ghost" size="icon" className="text-muted-foreground !shadow-none hover:text-foreground">
            <CaretRightIcon className="h-5 w-5" />
        </Button>
    )
}

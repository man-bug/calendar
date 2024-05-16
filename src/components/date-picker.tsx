"use client"
import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useVisibleDate } from "@/context/visible-date-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSelectedView } from "@/context/selected-view-context"

type Props = {
    todayBtn?: boolean;
    initialSelection?: Date;
    required?: boolean;
    customSelected?: Date;
    customSetter?: React.Dispatch<React.SetStateAction<any>>;
    abbreviated?: boolean
};

export function DatePicker({ todayBtn, initialSelection, customSetter, customSelected, required, abbreviated }: Props) {
    const [date, setDate] = React.useState<Date | undefined>(initialSelection ?? new Date())
    const { setVisibleDate } = useVisibleDate();
    const { selectedView } = useSelectedView();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    let formattedDate = format(date ?? new Date(), "PPP");
    if (abbreviated && customSelected) formattedDate = format(customSelected, "LLL dd, y")
    if (customSelected) formattedDate = format(customSelected, "PPP")
    if (initialSelection) formattedDate = format(initialSelection, "EEEE, PP")

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && !initialSelection && !customSelected && "text-muted-foreground",
                            isDesktop ? "w-[248px]" : "w-fit"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formattedDate}
                    </Button>
                    {todayBtn && <Button onClick={(e) => {e.stopPropagation(); setVisibleDate(new Date())}} variant="secondary" className="absolute right-0 h-9 rounded-l-none shadow-none" size="sm">Today</Button>}
                </div>
            </PopoverTrigger>
            <PopoverContent portalContainer className="w-auto p-0 z-[2500]" align="start">
                <Calendar
                    mode="single"
                    required={required ? true : false}
                    selected={customSelected ? customSelected : date}
                    onSelect={customSetter ? customSetter : setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}


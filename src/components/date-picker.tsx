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

type Props = {
    todayBtn?: boolean;
    initialSelection?: Date;
    required?: boolean;
    customSelected?: Date;
    customSetter?: React.Dispatch<React.SetStateAction<any>>;
};

export function DatePicker({ todayBtn, initialSelection, customSetter, customSelected, required }: Props) {
    const [date, setDate] = React.useState<Date | undefined>(initialSelection)
    const { setVisibleDate } = useVisibleDate();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[248px] justify-start text-left font-normal",
                            !date && !initialSelection && !customSelected && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date && initialSelection ? format(date, "EEEE, PP") : customSelected ? format(customSelected, "PPP") : date ? format(date, "PPP") : format(new Date(), "PPP")}
                    </Button>
                    {todayBtn && <Button onClick={(e) => {e.stopPropagation(); setVisibleDate(new Date())}} variant="secondary" className="absolute right-0 h-9 rounded-l-none shadow-none" size="sm">Today</Button>}
                </div>
            </PopoverTrigger>
            <PopoverContent portalContainer className="w-auto p-0" align="start">
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


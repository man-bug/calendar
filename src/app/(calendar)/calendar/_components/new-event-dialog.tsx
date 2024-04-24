import React from "react";
import { ArrowRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/date-picker";
import ColorPicker from "./color-picker";
import { Combobox } from "@/components/combo-box";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DateTime } from "./calendar-view";
import { addHours, addMinutes, format } from "date-fns";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDateTime: DateTime
}

export default function NewEventDialog({ open, setOpen, selectedDateTime }: Props) {
    const hourIntervals = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
    for (let i = 0; i < 96; i++) {
        const formattedTime = format(currentTime, "h:mm a");
        hourIntervals.push({ label: formattedTime, value: formattedTime });
        currentTime = addMinutes(currentTime, 15);
    }

    const repeatOptions = [
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 w-fit max-w-xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>New Event</DialogTitle>
                    <DialogDescription>Add a&nbsp;
                        <Button variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                            description
                        </Button>,&nbsp;
                        <Button variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                            location
                        </Button>
                        ,&nbsp;or&nbsp;
                        <Button variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                            label
                        </Button>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 space-y-2">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className="font-normal text-xs">
                                Date
                            </Label>
                            <DatePicker initialSelection={selectedDateTime.date} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-normal text-xs">
                                Time
                            </Label>
                            <div className="flex items-center gap-1">
                                <Combobox className="w-[calc(8ch+32px)]" initialValue={format(addHours(new Date(selectedDateTime.date), selectedDateTime.hour), "h:mm a")} options={hourIntervals} placeholder="From..." />
                                <ArrowRightIcon className="mx-1 h-4 w-4 text-muted-foreground" />
                                <Combobox className="w-[calc(8ch+32px)]" initialValue={format(addHours(new Date(selectedDateTime.date), selectedDateTime.hour + 1), "h:mm a")} options={hourIntervals} placeholder="To..." />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <Label className="font-normal text-xs">
                                    Repeat
                                </Label>
                                <Combobox initialValue={repeatOptions[0].value} options={repeatOptions} className="w-[248px]" triggerClassName="px-4 py-2 font-normal" placeholder="Repeats every...">
                                    <ReloadIcon className="mr-2 w-4 h-4" />
                                </Combobox>
                            </div>
                        </div>

                    </div>

                    <ColorPicker />
                </div>
                <DialogFooter className="bg-muted !justify-between p-4 px-6 border-t">
                    <DialogClose asChild>
                        <Button size="lg" className="h-9" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button size="lg" className="h-9">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

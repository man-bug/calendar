import React from "react";
import { ArrowRightIcon, CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import ColorPicker from "./color-picker";
import { Combobox } from "@/components/combo-box";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addMinutes, format } from "date-fns";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CalendarEvent } from "@prisma/client";
import { eventFormSchema, eventLabels, repeatOptions } from "./_util";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Props = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    selectedEvent: CalendarEvent
}
const formSchema = eventFormSchema;

export default function EditEventDialog({ open, setOpen, selectedEvent}: Props) {
    const hourIntervals: any[] = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
    for (let i = 0; i < 96; i++) {
        const formattedTime = format(currentTime, "h:mm a");
        hourIntervals.push({ label: formattedTime, value: formattedTime });
        currentTime = addMinutes(currentTime, 15);
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: selectedEvent.title,
            startDate: selectedEvent.startDate,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            repeat: selectedEvent.repeat,
            color: selectedEvent.color,
            label: selectedEvent.label,
        },
    });

    const [loading, setLoading] = React.useState(false)
    const toast = useToast();
    const router = useRouter();

    async function handleDelete() {
        const eventId = selectedEvent.id
        try {
            new Promise(async (resolve, reject) => {
                setLoading(true)
                try {
                    const res = await fetch("/api/events/delete-event", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            eventId
                        })
                    });

                    if (res.ok) {
                        resolve(res);
                        toast.toast({
                            title: "Event deleted",
                            description: "Event successfully deleted.",
                        });
                        setOpen(false);
                        router.refresh()
                    } else {
                        toast.toast({
                            title: "Error",
                            description: res.statusText ? res.statusText : "Unknown error",
                            variant: "destructive",
                        });
                    }
                } catch (err: any) {
                    reject(err || "Unknown error");
                }
                setLoading(false);
            });
        } catch (err: any) {
            console.error(err)
        }
        setLoading(false);
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            new Promise(async (resolve, reject) => {
                setLoading(true);
                try {
                    const res = await fetch("/api/events/update-event", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            eventId: selectedEvent.id,
                            title: values.title,
                            startDate: values.startDate,
                            startTime: values.startTime,
                            endTime: values.endTime,
                            repeat: values.repeat,
                            color: values.color,
                            label: values.label,
                        }),
                    });

                    if (res.ok) {
                        resolve(res);
                        toast.toast({
                            title: "Event updated",
                            description: "Event successfully updated.",
                        });
                        setOpen(false);
                        router.refresh();
                    } else {
                        toast.toast({
                            title: "Error",
                            description: res.statusText ? res.statusText : "Unknown error",
                            variant: "destructive",
                        });
                    }
                } catch (err: any) {
                    reject(err || "Unknown error");
                }
                setLoading(false);
            });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 w-fit max-w-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="p-6 pb-2 space-y-0.5">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-0 mr-4">
                                        <Input
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="p-0 border-0 border-b border-transparent shadow-none !text-xl font-semibold leading-none tracking-tight text-foreground h-fit !ring-0 hover:border-primary focus:border-primary focus-within:border-primary focus-visible:border-primary rounded-none"
                                        />
                                    </FormItem>
                                )}
                            />
                            <DialogDescription>Add a&nbsp;
                                <Button type="button" variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                                    description
                                </Button>,&nbsp;
                                <Button disabled variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                                    location
                                </Button>
                                ,&nbsp;or&nbsp;
                                <Button disabled variant="link" className="h-fit p-0 text-muted-foreground hover:text-primary/80">
                                    label
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="px-6 space-y-2 pb-2">
                            <div className="grid grid-cols-2 items-center gap-2">
                                <FormField // date picker
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0 flex flex-col w-full">
                                            <FormLabel className="font-normal text-xs">Start date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className="relative">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className={cn("w-[248px] justify-start text-left font-normal",)}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {format(field.value, "EEEE, PP")}
                                                        </Button>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent portalContainer className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        required
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col">
                                    <Label className="font-normal text-xs">Time</Label>
                                    <div className="flex items-center gap-1">
                                        <FormField
                                            control={form.control}
                                            name="startTime"
                                            render={({ field }) => ( // event start time
                                                <FormItem className="space-y-0 flex flex-col w-full">
                                                    <Combobox className="w-full" initialValue={field.value} customSetter={field.onChange} options={hourIntervals} placeholder="From..." />
                                                </FormItem>
                                            )}
                                        />
                                        <ArrowRightIcon className="mx-1 h-4 w-4 text-muted-foreground shrink-0" />
                                        <FormField
                                            control={form.control}
                                            name="endTime"
                                            render={({ field }) => ( // event end time
                                                <FormItem className="space-y-0 flex flex-col w-full">
                                                    <Combobox className="w-full" initialValue={field.value} customSetter={field.onChange} options={hourIntervals} placeholder="To..." />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="repeat"
                                    render={({ field }) => ( // event repeat
                                        <FormItem className="space-y-0 flex flex-col w-full">
                                            <FormLabel className="font-normal text-xs">Repeat</FormLabel>
                                            <Combobox initialValue={field.value} customSetter={field.onChange} options={repeatOptions} className="w-[248px]" triggerClassName="px-4 py-2 font-normal" placeholder="Repeats...">
                                                <ReloadIcon className="mr-2 w-4 h-4" />
                                            </Combobox>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name="label"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0 flex flex-col w-full">
                                                <FormLabel className="font-normal text-xs">Label</FormLabel>
                                                <Combobox initialValue={field.value} customSetter={field.onChange} options={eventLabels} className="w-full" triggerClassName="w-full" placeholder="Has label..." />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0 flex flex-col w-fit">
                                                <FormLabel className="font-normal text-xs">Color</FormLabel>
                                                <ColorPicker defaultValue={field.value} onValueChange={field.onChange} value={field.value} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="advanced" className="border-b-0">
                                    <AccordionTrigger className="font-normal text-xs">
                                        Advanced
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Button type="button" onClick={() => handleDelete()} variant="destructive">
                                            Delete event
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>


                        <DialogFooter className="bg-muted !justify-between p-4 px-6 border-t">
                            <DialogClose asChild>
                                <Button disabled={loading} type="button" size="lg" className="h-9" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={loading} type="submit" size="lg" className="h-9">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

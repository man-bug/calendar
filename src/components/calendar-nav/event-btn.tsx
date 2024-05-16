"use client";
import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import NewEventDialog from "@/app/(calendar)/calendar/_components/new-event-dialog";
import { setMinutes } from "date-fns";

export default function EventBtn() {
    const [newEventDialogOpen, setNewEventDialogOpen] = React.useState(false);
    const now = new Date();
    return (
        <>
            <Button onClick={() => setNewEventDialogOpen(true)}className="w-12 h-12 rounded-full flex my-8" size="icon">
                <PlusIcon className="w-5 h-5" />
            </Button>
            {newEventDialogOpen && <NewEventDialog open={newEventDialogOpen} setOpen={setNewEventDialogOpen} selectedDateTime={{ date: setMinutes(now, 0), hour: now.getHours() }} />}
        </>
    )
}

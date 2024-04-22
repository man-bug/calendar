import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default function EventBtn() {
    return (
        <Button className="w-12 h-12 rounded-full flex my-8" size="icon">
            <PlusIcon className="w-5 h-5" />
        </Button>
    )
}

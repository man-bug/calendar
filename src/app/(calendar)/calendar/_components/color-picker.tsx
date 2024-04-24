import { Button } from "@/components/ui/button";
import React from "react";

export default function ColorPicker() {
    const colors = [
        {
            label: "purple",
            hex: "#CC99C9",
        },
        {
            label: "green",
            hex: "#9EE09E",
        },
        {
            label: "blue",
            hex: "#9EC1CF",
        },
        {
            label: "orange",
            hex: "#FEB144",
        },
        {
            label: "red",
            hex: "#FF6663",
        },
    ];
    return (
        <div className="flex w-full items-center space-x-1">
            {colors.map((color, idx) => (
                <Button key={idx} variant="ghost" size="icon">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.hex }} />
                </Button>

            ))}
        </div>
    )
}

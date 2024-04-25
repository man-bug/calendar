import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import React from "react";

type Props = {
    value: string,
    onValueChange: () => void,
    defaultValue: string,
}
export default function ColorPicker({ value, onValueChange, defaultValue }: Props) {
    const colors = ["#CC99C9", "#9EE09E", "#9EC1CF", "#FEB144", "#FF6663",];
    return (
        <Select onValueChange={onValueChange} defaultValue={defaultValue}>
            <SelectTrigger className="w-fit">
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: value }}/>
            </SelectTrigger>
            <SelectContent className="w-fit">
                {colors.map((color, idx) => (
                    <SelectItem className="w-fit" key={idx} value={color}>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }}/>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

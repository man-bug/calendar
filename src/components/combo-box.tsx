import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type Props = {
    options: { label: string; value: string }[];
    placeholder: string;
    initialValue: string;
    customValue?: string;
    customSetter?: React.Dispatch<React.SetStateAction<any>>;
    className?: string;
    triggerClassName?: string;
    children?: React.ReactNode;
};

export function Combobox({ options, placeholder, initialValue, customValue, customSetter, className, triggerClassName, children }: Props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(initialValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("px-2", className, triggerClassName)}
                >
                    {children}
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : initialValue}
                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("p-0", className)}>
                <Command className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                    <CommandInput placeholder={placeholder ? placeholder : "Select..."} className="h-9" />
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandList>
                        <ScrollArea>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={customValue ? customValue : option.value}
                                        onSelect={
                                            (currentValue) => {
                                                customSetter
                                                    ? (customSetter(currentValue), setValue(currentValue)) // first return selection to customSetter, then update UI
                                                    : setValue(currentValue)
                                                setOpen(false)
                                            }
                                        }
                                    >
                                        {option.label}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-3 w-3",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <ScrollBar />
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import AuthBtns from "../nav/auth-btns";
import VisibleDateNav from "./visible-date-nav";
import NavDatePicker from "./nav-date-picker";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export default function TopNav() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <header className="fixed left-0 top-0 flex h-16 w-full items-center border-b border-border/75 bg-background z-[2000]">
            <div className="w-full relative flex items-center justify-between px-2 pr-[22px]">
                <div className="space-x-2 flex items-center">
                    <Button variant="ghost" size="icon" className={cn("shrink-0", isDesktop ? "w-12 h-12" : "w-10 h-10")}>
                        <HamburgerMenuIcon className="w-5 h-5" />
                    </Button>
                    {isDesktop &&
                        <>
                            <Link className="font-serif text-2xl font-extrabold tracking-tight" href="/calendar">calendar</Link>
                            <div className="ml-4">
                                 <VisibleDateNav />
                            </div>
                        </>
                    }
                </div>

                {!isDesktop && <NavDatePicker />}

                <div className="space-x-2 flex items-center">
                    {isDesktop && <NavDatePicker />}
                    <AuthBtns />
                </div>
            </div>
        </header>
    )
}


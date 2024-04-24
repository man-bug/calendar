import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { DatePicker } from "../date-picker";
import AuthBtns from "../nav/auth-btns";
import VisibleDateNav from "./visible-date-nav";

export default function TopNav() {

    return (
        <header className="fixed left-0 top-0 flex h-16 w-full items-center border-b border-border/75 bg-background">
            <div className="w-full relative flex items-center justify-between px-2 pr-[22px]">
                <div className="space-x-2 flex items-center">
                    <Button variant="ghost" size="icon" className="w-12 h-12">
                        <HamburgerMenuIcon className="w-5 h-5" />
                    </Button>
                    <Link className="font-serif text-2xl font-extrabold tracking-tight" href="/calendar">calendar</Link>
                </div>

                <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
                    <VisibleDateNav />
                </div>


                <div className="space-x-2 flex items-center">
                    <DatePicker todayBtn />
                    <AuthBtns />
                </div>
            </div>
        </header>
    )
}


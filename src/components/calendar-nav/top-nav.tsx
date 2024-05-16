"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import AuthBtns from "../nav/auth-btns";
import VisibleDateNav from "./visible-date-nav";
import NavDatePicker from "./nav-date-picker";
import { useMediaQuery } from "@/hooks/use-media-query";
import useDomLoaded from "@/hooks/use-dom-loaded";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { AddDateBtn, SubtractDateBtn } from "./date-buttons";

export default function TopNav() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const init = useDomLoaded();
    const { data: session } = useSession();

    return (
        <header className="fixed left-0 top-0 flex h-16 w-full items-center border-b border-border/75 bg-background z-[2000]">
            <div className="w-full relative flex items-center justify-between px-2 md:pr-5">
                <div className="space-x-2 flex items-center">
                    <Button variant="ghost" size="icon" className="shrink-0 w-10 h-10 md:m-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z" fill="currentColor"></path></svg>
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

                {!isDesktop && init &&
                    <div className="flex items-center gap-1">
                        <SubtractDateBtn />
                        <NavDatePicker abbr />
                        <AddDateBtn />
                    </div>
                }
                {!isDesktop && !init && <Skeleton className="w-52 h-9 rounded-md" />}

                <div className="space-x-2 flex items-center">
                    {isDesktop && <NavDatePicker />}
                    {init && session?.user ? <AuthBtns session={session} /> : <Skeleton className="w-10 h-10 rounded-full" />}
                </div>
            </div>
        </header>
    )
}


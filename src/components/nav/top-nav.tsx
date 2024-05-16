"use client";
import React from "react";
import Link from "next/link";
import DesktopNav from "./desktop-nav";
import AuthBtns from "./auth-btns";
import { useSession } from "next-auth/react";

export default function TopNav() {
    const { data: session } = useSession();

    return (
        <header className="fixed left-0 top-0 flex h-16 w-full items-center">
            <div className="container relative flex mx-auto max-w-screen-xl items-center justify-between">
                <Link className="font-serif text-2xl font-extrabold tracking-tight" href="/">calendar</Link>
                <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
                    <DesktopNav />
                </nav>
                <AuthBtns session={session} />
            </div>
        </header>
    )
}

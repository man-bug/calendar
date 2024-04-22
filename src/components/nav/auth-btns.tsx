"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function AuthBtns() {
    const { data: session } = useSession();

    return session && session.user?.email
        ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-none bg-transparent shadow-none h-fit w-fit rounded-full"
                >
                    <Avatar>
                        <AvatarFallback>
                            {session.user.email.substring(0, 1).toUpperCase() + session.user.email.substring(1, 2).toLowerCase() || "Me"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Account menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        My profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="!text-destructive" onClick={() => signOut()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        : <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/login">
                    Login
                </Link>
            </Button>
            <Button asChild>
                <Link href="/sign-up">
                    Sign up
                    <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                </Link>
            </Button>
        </div>
}

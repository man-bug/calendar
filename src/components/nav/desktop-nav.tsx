"use client";
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Link from "next/link";

export default function DesktopNav() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link legacyBehavior passHref href="#features">
                        <NavigationMenuTrigger>
                            features
                        </NavigationMenuTrigger>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link legacyBehavior passHref href="#pricing">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            pricing
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

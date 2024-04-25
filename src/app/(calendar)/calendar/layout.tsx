import SideNav from "@/components/calendar-nav/side-nav";
import TopNav from "@/components/calendar-nav/top-nav";
import { SelectedLayoutProvider } from "@/context/selected-layout-context";
import { SelectedViewProvider } from "@/context/selected-view-context";
import { VisibleDateProvider } from "@/context/visible-date-context";
import React from "react";

export default function CalendarLayout({ children }: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex flex-col">
            <SelectedViewProvider>
                <SelectedLayoutProvider>
                    <VisibleDateProvider>
                        <TopNav />
                        <SideNav />
                        {children}
                    </VisibleDateProvider>
                </SelectedLayoutProvider>
            </SelectedViewProvider>
        </div>
    )
}

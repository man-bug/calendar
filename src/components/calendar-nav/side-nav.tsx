"use client";
import React from "react";
import EventBtn from "./event-btn";
import { Button } from "../ui/button";
import { useSelectedView, views } from "@/context/selected-view-context";
import { layouts, useSelectedLayout } from "@/context/selected-layout-context";


export default function SideNav() {
    const { selectedView, setSelectedView } = useSelectedView();
    const { selectedLayout, setSelectedLayout } = useSelectedLayout();

    return (
        <aside className="w-16 h-[calc(100vh-63px)] fixed left-0 top-[63px] bg-background border-r border-border/75 z-50">
            <div className="flex flex-col items-center gap-2">
                {views.map((view, idx) => (
                    <Button key={idx} onClick={() => setSelectedView(view)} variant={selectedView === view ? "secondary" : "outline"} size="icon" className="w-10 h-10">
                        {React.createElement(view.icon, { className: "h-5 w-5" })}
                    </Button>
                ))}
                <EventBtn />
                {layouts.map((layout, idx) => (
                    <Button key={idx} onClick={() => setSelectedLayout(layout)} variant={selectedLayout === layout ? "secondary" : "outline"} size="icon" className="w-10 h-8">
                        {React.createElement(layout.icon, { className: "h-4 w-4" })}
                    </Button>
                ))}
            </div>
        </aside>
    )
}
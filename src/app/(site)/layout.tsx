import TopNav from "@/components/nav/top-nav";
import React from "react";

export default function SiteLayout({ children }: {children: React.ReactNode }) {
    return (
        <>
            <TopNav />
            <div className="flex flex-col min-h-screen pt-16">
                {children}
            </div>
        </>
    )
}

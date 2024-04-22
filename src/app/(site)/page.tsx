import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function Home() {

    return (
        <main className="container max-w-screen-lg">
            <section className="flex flex-col gap-3 py-8 md:py-16 lg:py-20">
                <h1 className="text-2xl font-extrabold md:text-3xl lg:text-5xl">Manage your schedule faster.</h1>
                <p className="max-w-[50ch] text-base font-light md:text-lg lg:text-xl">Stay organized &amp; on top of your schedule. Effortlessly manage your time and tasks seamless planning.</p>
                <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
                    <Input className="sm:max-w-[35ch]" placeholder="Enter your email" />
                    <Button size="lg" className="w-full sm:w-fit">
                        Start planning
                    </Button>
                </div>
            </section>
            {/* TODO: Image of calendar app */}
            <hr className="h-px bg-muted"/>
            {/* TODO: Features, pricing sections */}
        </main>
    )
}

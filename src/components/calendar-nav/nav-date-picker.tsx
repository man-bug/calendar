"use client";
import { useVisibleDate } from "@/context/visible-date-context";
import React from "react";
import { DatePicker } from "../date-picker";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function NavDatePicker() {
    const { visibleDate, setVisibleDate } = useVisibleDate();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <DatePicker required customSelected={visibleDate} customSetter={setVisibleDate} todayBtn={isDesktop ? true : false} />
    )
}

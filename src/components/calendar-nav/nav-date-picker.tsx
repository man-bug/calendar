"use client";
import { useVisibleDate } from "@/context/visible-date-context";
import React from "react";
import { DatePicker } from "../date-picker";

export default function NavDatePicker() {
    const { visibleDate, setVisibleDate } = useVisibleDate();

    return (
        <DatePicker customSelected={visibleDate} customSetter={setVisibleDate} todayBtn />
    )
}

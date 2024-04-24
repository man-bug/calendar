"use client";
import { startOfDay } from "date-fns";
import React from "react";

type VisibleDateContextProps = {
    visibleDate: Date;
    setVisibleDate: React.Dispatch<React.SetStateAction<Date>>;
}
export const VisibleDateContext = React.createContext<VisibleDateContextProps | undefined>(undefined);

export const VisibleDateProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
    const today = startOfDay(new Date());
    const [visibleDate, setVisibleDate] = React.useState<Date>(today);
    return (
        <VisibleDateContext.Provider value={{ visibleDate, setVisibleDate }}>
            {children}
        </VisibleDateContext.Provider>
    );
};

export const useVisibleDate = () => {
    const context = React.useContext(VisibleDateContext);
    if (!context) throw new Error("useVisibleDate must be used within a VisibleDateProvider");
    return context;
};

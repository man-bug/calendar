"use client";
import React from "react";
import { IconType } from "react-icons/lib";
import { TbLayoutDistributeHorizontal } from "react-icons/tb";
import { RxViewHorizontal } from "react-icons/rx";

export type Layout = { type: string, icon: IconType };
export const layouts: Layout[] = [
    {
        type: "dense",
        icon: TbLayoutDistributeHorizontal,
    },
    {
        type: "comfortable",
        icon: RxViewHorizontal,
    },
];

type SelectedLayoutContextProps = {
    selectedLayout: Layout;
    setSelectedLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
export const SelectedLayoutContext = React.createContext<SelectedLayoutContextProps | undefined>(undefined);

export const SelectedLayoutProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
    const [selectedLayout, setSelectedLayout] = React.useState<Layout>(layouts[0]);
    return (
        <SelectedLayoutContext.Provider value={{ selectedLayout, setSelectedLayout }}>
            {children}
        </SelectedLayoutContext.Provider>
    );
};

export const useSelectedLayout = () => {
    const context = React.useContext(SelectedLayoutContext);
    if (!context) throw new Error("useSelectedLayout must be used within a SelectedLayoutProvider");
    return context;
};

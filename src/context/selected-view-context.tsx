"use client";
import React from "react";
import { CgUiKit, CgViewCols, CgViewGrid } from "react-icons/cg";
import { IconType } from "react-icons/lib";

export type View = { type: string, icon: IconType };
export const views: View[] = [
    {
        type: "day",
        icon: CgUiKit,
    },
    {
        type: "week",
        icon: CgViewCols,
    },
    {
        type: "month",
        icon: CgViewGrid,
    }
];

type SelectedViewContextProps = {
    selectedView: View;
    setSelectedView: React.Dispatch<React.SetStateAction<View>>;
}
export const SelectedViewContext = React.createContext<SelectedViewContextProps | undefined>(undefined);

export const SelectedViewProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
    const [selectedView, setSelectedView] = React.useState<View>(views[0]);
    return (
        <SelectedViewContext.Provider value={{ selectedView, setSelectedView }}>
            {children}
        </SelectedViewContext.Provider>
    );
};

export const useSelectedView = () => {
    const context = React.useContext(SelectedViewContext);
    if (!context) throw new Error("useSelectedView must be used within a SelectedViewProvider");
    return context;
};

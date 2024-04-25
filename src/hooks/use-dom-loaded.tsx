"use client";
import React from "react";

export default function useDomLoaded() {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        setLoaded(true);
    }, []);

    return loaded
}

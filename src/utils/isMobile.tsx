import { useEffect, useState } from "react";

export function isMobile() {
    const [Mobile, setIsMobile] = useState(false);
    useEffect(() => {
        const widthScreen = typeof window.innerWidth === "undefined" ? false : window.innerWidth;
        setIsMobile(widthScreen < 600);
    })
    return { Mobile };
}
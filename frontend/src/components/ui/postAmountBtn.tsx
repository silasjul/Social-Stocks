"use client";

import React from "react";
import { useTheme } from "next-themes";


function PostAmountBtn({
    children,
    onClick,
    size = 8,
} : {
    children: React.ReactNode;
    onClick?: () => void;
    size?: number;
}) {
    const { forcedTheme } = useTheme();
    const sizeClass = `w-${size} h-${size}`;

    return (
        <button onClick={onClick}
        className={`${sizeClass} rounded-lg bg-primary text-lg flex items-center justify-center transition-colors duration-200 
            ${forcedTheme === 'dark' ? "text-white" : "text-black"}
            hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            `}
        >
            {children}
        </button>
    );

} export default PostAmountBtn
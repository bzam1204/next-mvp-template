'use client';

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme, isReady } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            onClick={toggleTheme}
            disabled={!isReady}
        >
            <Sun
                className={cn(
                    "h-5 w-5 transition-opacity duration-200",
                    isDark ? "opacity-0" : "opacity-100",
                )}
            />
            <Moon
                className={cn(
                    "absolute h-5 w-5 transition-opacity duration-200",
                    isDark ? "opacity-100" : "opacity-0",
                )}
            />
            <span className="sr-only">Toggle color theme</span>
        </Button>
    );
}

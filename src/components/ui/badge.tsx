import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
                secondary: "border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                outline: "text-gray-900 dark:text-gray-100",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => {
    return (
        <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };

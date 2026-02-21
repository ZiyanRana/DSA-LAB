import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Data structure themed variants
        stack: "bg-ds-stack text-primary-foreground hover:bg-ds-stack/90 shadow-md hover:shadow-lg",
        queue: "bg-ds-queue text-primary-foreground hover:bg-ds-queue/90 shadow-md hover:shadow-lg",
        linkedlist: "bg-ds-linkedlist text-primary-foreground hover:bg-ds-linkedlist/90 shadow-md hover:shadow-lg",
        tree: "bg-ds-tree text-primary-foreground hover:bg-ds-tree/90 shadow-md hover:shadow-lg",
        graph: "bg-ds-graph text-secondary-foreground hover:bg-ds-graph/90 shadow-md hover:shadow-lg",
        sort: "bg-ds-sort text-primary-foreground hover:bg-ds-sort/90 shadow-md hover:shadow-lg",
        // Terminal style
        terminal: "bg-muted border border-primary/30 text-primary font-mono hover:bg-primary/10 hover:border-primary/50 transition-all",
        terminalSecondary: "bg-muted border border-secondary/30 text-secondary font-mono hover:bg-secondary/10 hover:border-secondary/50 transition-all",
        terminalAccent: "bg-muted border border-accent/30 text-accent font-mono hover:bg-accent/10 hover:border-accent/50 transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

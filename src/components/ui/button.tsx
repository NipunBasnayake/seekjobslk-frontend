import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "ui-button";

    const variantStyles = {
      default: "ui-button-primary",
      primary: "ui-button-primary",
      secondary: "ui-button-secondary",
      ghost: "ui-button-ghost",
    };

    const sizeStyles = {
      default: "",
      sm: "min-h-10 px-3.5 text-sm",
      lg: "min-h-12 px-6 text-base",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    return <button className={combinedClassName} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };

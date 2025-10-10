// components/ui/spinner.tsx
import React from "react";

export default function Spinner({
  className = "h-5 w-5 text-white",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="0"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="15"
      />
    </svg>
  );
}

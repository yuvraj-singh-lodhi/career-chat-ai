import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block">{children}</div>;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <button type="button">{children}</button>;
}

interface DropdownMenuContentProps {
  align?: "start" | "end";
  children: React.ReactNode;
}

export function DropdownMenuContent({ align = "start", children }: DropdownMenuContentProps) {
  return (
    <div
      className={`absolute z-10 mt-2 min-w-[8rem] rounded-md bg-white shadow-lg border border-gray-200 ${
        align === "end" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export function DropdownMenuItem({ onClick, children }: DropdownMenuItemProps) {
  return (
    <div
      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
import { PropsWithChildren } from "react";

export function FullWrap({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "w-full h-full z-20 left-0 top-0 absolute pointer-events-none " +
        className
      }
    >
      {children}
    </div>
  );
}

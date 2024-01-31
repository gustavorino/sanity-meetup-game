import { twMerge } from "tailwind-merge";

export function Card({
  label,
  answered,
  blink,
  disabled,
}: {
  label: string;
  blink?: boolean;
  disabled?: boolean;
  answered?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "transition-all duration-100 size-24 font-extrabold text-4xl flex items-center justify-center border-white border-2 rounded-bl-2xl rounded-tr-2xl text-white bg-orange1",
        blink && "bg-white text-orange1",
        disabled && "opacity-30",
        answered && "bg-blue1"
      )}
    >
      {label}
    </div>
  );
}

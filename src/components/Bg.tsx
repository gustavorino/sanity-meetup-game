import { PropsWithChildren } from "react";

export function Bg({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full from-purple1 to-purple2 bg-gradient-to-br">
      {children}
    </div>
  );
}

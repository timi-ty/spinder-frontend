import { ReactNode } from "react";
import PopupProvider from "./PopupProvider";
import ToastProvider from "./ToastProvider";
import TooltipProvider from "./TooltipProvider";

function withOverlayProviders(children: ReactNode) {
  return () => (
    <ToastProvider>
      <PopupProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </PopupProvider>
    </ToastProvider>
  );
}

export default withOverlayProviders;

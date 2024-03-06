import { createContext } from "react";

const InteractionPanelContext = createContext(document.getElementById("root")!);

const ToastContext = createContext(
  (_message: string, _location: "Top" | "Bottom" = "Top") => {}
);

export { InteractionPanelContext, ToastContext };

import { createContext } from "react";

const InteractionPanelContext = createContext(document.getElementById("root")!);

export { InteractionPanelContext };

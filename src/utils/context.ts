import { createContext } from "react";
import { defaultAuthState } from "./models";

const AuthContext = createContext(defaultAuthState);

export { AuthContext };

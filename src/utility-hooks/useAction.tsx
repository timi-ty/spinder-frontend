import { useDispatch, useSelector } from "react-redux";
import { AuthMode } from "../state/slice.auth";
import { StoreState } from "../state/store";
import { attemptUnauthorizedAction } from "../state/slice.globalui";

interface ActionOptions {
  requiresFullAuth: boolean;
  actionDescription: string;
}

function useAction() {
  const dispatch = useDispatch();
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );

  function doAction(action: () => void, options: ActionOptions) {
    if (!options.requiresFullAuth) {
      action();
      return;
    }
    if (authMode === "Full") {
      action();
    } else {
      dispatch(attemptUnauthorizedAction(options.actionDescription));
    }
  }

  return doAction;
}

export default useAction;

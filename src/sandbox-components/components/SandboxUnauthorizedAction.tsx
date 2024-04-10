import { useDispatch } from "react-redux";
import "../styles/SandboxUnauthorizedAction.scss";
import { dissmissUnauthorizedAction } from "../../state/slice.globalui";
import { setAuthMode } from "../../state/slice.auth";

interface Props {
  actionDescription: string;
}

function SandboxUnauthorizedAction({ actionDescription }: Props) {
  const dispatch = useDispatch();

  function onClickSignIn() {
    dispatch(dissmissUnauthorizedAction());
    dispatch(setAuthMode("UnacceptedAnon"));
  }

  function onClickContinue() {
    dispatch(dissmissUnauthorizedAction());
    dispatch(setAuthMode("AcceptedAnon"));
  }

  return (
    <div className="sandbox-unauth-action">
      <div className="title">You'd have to sign in</div>
      <div className="message">Sign in to {actionDescription}.</div>
      <button className="button" onClick={onClickSignIn}>
        Sign In
      </button>
      <div className="link" onClick={onClickContinue}>
        Continue anonymously
      </div>
    </div>
  );
}

export default SandboxUnauthorizedAction;

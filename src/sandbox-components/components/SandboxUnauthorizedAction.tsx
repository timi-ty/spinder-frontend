import { useDispatch } from "react-redux";
import styles from "../styles/SandboxUnauthorizedAction.module.css";
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
    <div className={styles.sandboxUnauthAction}>
      <div className={styles.title}>You'd have to sign in</div>
      <div className={styles.message}>Sign in to {actionDescription}.</div>
      <button className={styles.button} onClick={onClickSignIn}>
        Sign In
      </button>
      <div className={styles.link} onClick={onClickContinue}>
        Continue anonymously
      </div>
    </div>
  );
}

export default SandboxUnauthorizedAction;

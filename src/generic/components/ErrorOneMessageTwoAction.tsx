import styles from "../styles/ErrorOneMessageTwoAction.module.css";

interface ErrorAction {
  name: string;
  action: () => void;
}

interface Props {
  message: string;
  actionOne: ErrorAction;
  actionTwo: ErrorAction;
}

function ErrorOneMessageTwoAction({ message, actionOne, actionTwo }: Props) {
  return (
    <div className={styles.errorOneMessageTwoAction}>
      <div className={styles.message}>{message}</div>
      <button title={actionOne.name} onClick={() => actionOne.action()}>
        {actionOne.name}
      </button>
      <button
        title={actionTwo.name}
        className="secondary"
        onClick={() => actionTwo.action()}
      >
        {actionTwo.name}
      </button>
    </div>
  );
}

export default ErrorOneMessageTwoAction;

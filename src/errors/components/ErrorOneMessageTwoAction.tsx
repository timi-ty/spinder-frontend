import "../styles/ErrorOneMessageTwoAction.scss";

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
    <div className="error-one-message-two-action">
      <div className="message">{message}</div>
      <button className="button" onClick={() => actionOne.action()}>
        {actionOne.name}
      </button>
      <button className="button" onClick={() => actionTwo.action()}>
        {actionTwo.name}
      </button>
    </div>
  );
}

export default ErrorOneMessageTwoAction;

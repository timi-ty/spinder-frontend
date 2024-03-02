import "../styles/ErrorSourceDeck.scss";

interface Props {
  resetSourceDeck: () => void;
  openSourcePicker: () => void;
}

function ErrorSourceDeck({ resetSourceDeck, openSourcePicker }: Props) {
  return (
    <div className="error-source-deck">
      <div className="message">
        We encountered a problem while curating your deck. If this error
        persists, please try a different source.
      </div>
      <button className="button" onClick={() => resetSourceDeck()}>
        Retry
      </button>
      <button className="button" onClick={() => openSourcePicker()}>
        Change Source
      </button>
    </div>
  );
}

export default ErrorSourceDeck;

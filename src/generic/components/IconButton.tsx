import "../styles/IconButton.scss";

interface Props {
  icon: string;
  onAction: () => void;
}

function IconButton({ icon, onAction }: Props) {
  return (
    <button className="icon-button" onClick={onAction}>
      <img className="icon" src={icon} />
    </button>
  );
}

export default IconButton;

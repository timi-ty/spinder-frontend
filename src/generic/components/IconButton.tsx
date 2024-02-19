import "../styles/IconButton.scss";

interface Props {
  icon: string;
  onAction: () => void;
}

function IconButton({ icon, onAction }: Props) {
  return <img className="icon-button" src={icon} onClick={onAction} />;
}

export default IconButton;

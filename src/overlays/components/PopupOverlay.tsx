import { ReactNode } from "react";
import "../styles/PopupOverlay.scss";

interface PopupAction {
  text: string;
  action: () => void;
}

interface PopupProps {
  title: string;
  message: string;
  buttons: PopupAction[];
  links: PopupAction[];
}

function GenericPopupOverlay({ title, message, buttons, links }: PopupProps) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        {buttons.length > 0 && (
          <div className="buttons">
            {buttons.map((button) => (
              <button
                key={button.text}
                className="button"
                onClick={button.action}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="links">
            {links.map((link) => (
              <a key={link.text} className="link" onClick={link.action}>
                {link.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomPopupOverlay(popup: ReactNode) {
  return (
    <div className="popup-overlay">
      <div className="popup">{popup}</div>
    </div>
  );
}

export default GenericPopupOverlay;

export { CustomPopupOverlay, type PopupProps };

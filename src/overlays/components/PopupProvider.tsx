import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import "../styles/PopupOverlay.scss";

interface PopupAction {
  text: string;
  action: () => void;
}

interface GenericPopupProps {
  title: string;
  message: string;
  buttons: PopupAction[];
  links: PopupAction[];
}

function GenericPopupOverlay({
  title,
  message,
  buttons,
  links,
}: GenericPopupProps) {
  return (
    <div className="popup-overlay">
      <div className="generic-popup">
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

interface CustomPopupProps {
  sandboxComponent: ReactNode;
}

function CustomPopupOverlay({ sandboxComponent }: CustomPopupProps) {
  return (
    <div className="popup-overlay">
      <div className="custom-popup">{sandboxComponent}</div>
    </div>
  );
}

const PopupContext = createContext({
  pushPopup: (_owner: string, _popup: GenericPopupProps | ReactNode) => {},
  clearPopup: (_owner: string) => {},
});

interface ProviderProps {
  children?: ReactNode;
}

function PopupProvider({ children }: ProviderProps) {
  const [popups, setPopups] = useState(
    new Map<string, GenericPopupProps | ReactNode>()
  );
  const [currentPopup, setCurrentPopup] = useState(popups.get(""));

  function pushPopup(owner: string, popup: GenericPopupProps | ReactNode) {
    setPopups((oldPopups) => {
      const newPopups = new Map();
      oldPopups.forEach((value, key) => newPopups.set(key, value));
      newPopups.set(owner, popup);
      return newPopups;
    });
  }

  function clearPopup(owner: string) {
    setPopups((oldPopups) => {
      const newPopups = new Map();
      oldPopups.forEach((value, key) => newPopups.set(key, value));
      newPopups.delete(owner);
      return newPopups;
    });
  }

  useEffect(() => {
    if (popups.size > 0) {
      const firstKey = popups.keys().next().value;
      setCurrentPopup(popups.get(firstKey));
    } else {
      setCurrentPopup(undefined);
    }
  }, [popups]);

  const isCustomPopup = useMemo(
    () =>
      currentPopup && (currentPopup as GenericPopupProps).title === undefined,
    [currentPopup]
  );

  return (
    <PopupContext.Provider value={{ pushPopup, clearPopup }}>
      {children}
      {currentPopup && isCustomPopup && (
        <CustomPopupOverlay sandboxComponent={currentPopup as ReactNode} />
      )}
      {currentPopup && !isCustomPopup && (
        <GenericPopupOverlay {...(currentPopup as GenericPopupProps)} />
      )}
    </PopupContext.Provider>
  );
}

export default PopupProvider;

export { PopupContext };

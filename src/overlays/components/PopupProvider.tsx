import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import styles from "../styles/PopupOverlay.module.css";
import { useDispatch } from "react-redux";
import { setIsPopupShowing } from "../../state/slice.globalui";
import useWindowSize from "../../utility-hooks/useWindowSize";

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
  const [, windowHeight] = useWindowSize();

  return (
    <div
      className={styles.popupOverlay}
      style={{ maxHeight: `${windowHeight}px` }}
    >
      <div className={styles.genericPopup}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
        {buttons.length > 0 && (
          <div className={styles.buttons}>
            {buttons.map((button) => (
              <button
                key={button.text}
                className={styles.button}
                onClick={button.action}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className={styles.links}>
            {links.map((link) => (
              <a key={link.text} className={styles.link} onClick={link.action}>
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
  const [, windowHeight] = useWindowSize();

  return (
    <div
      className={styles.popupOverlay}
      style={{ maxHeight: `${windowHeight}px` }}
    >
      <div className={styles.customPopup}>{sandboxComponent}</div>
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
  const dispatch = useDispatch();
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
      dispatch(setIsPopupShowing(true));
      const firstKey = popups.keys().next().value;
      setCurrentPopup(popups.get(firstKey));
    } else {
      dispatch(setIsPopupShowing(false));
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

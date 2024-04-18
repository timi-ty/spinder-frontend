import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import styles from "../styles/PopupOverlay.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsPopupShowing } from "../../state/slice.globalui";
import useWindowSize from "../../utility-hooks/useWindowSize";
import { StoreState } from "../../state/store";

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

interface Popup {
  owner: string;
  value: GenericPopupProps | ReactNode;
}

const PopupContext = createContext({
  pushPopup: (_popup: Popup) => {},
  clearPopup: (_owner: string) => {},
});

interface ProviderProps {
  children?: ReactNode;
}

function PopupProvider({ children }: ProviderProps) {
  const dispatch = useDispatch();
  const isPopupShowing = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isPopupShowing
  );
  const [popups, setPopups] = useState(() => {
    const emptyPopups: Popup[] = [];
    return emptyPopups;
  });
  const [currentPopup, setCurrentPopup] = useState(popups[0]);

  function pushPopup(popup: Popup) {
    setPopups((oldPopups) => {
      const newPopups = oldPopups.filter(
        (oldPopup) => oldPopup.owner !== popup.owner
      );
      return [...newPopups, popup];
    });
  }

  function clearPopup(owner: string) {
    setPopups((oldPopups) =>
      oldPopups.filter((popup) => popup.owner !== owner)
    );
  }

  useEffect(() => {
    if (popups.length > 0) {
      dispatch(setIsPopupShowing(true));
      setCurrentPopup(popups[0]);
    } else {
      dispatch(setIsPopupShowing(false));
    }
  }, [popups]);

  const isCustomPopup = useMemo(
    () =>
      currentPopup &&
      (currentPopup.value as GenericPopupProps).title === undefined,
    [currentPopup]
  );

  return (
    <PopupContext.Provider value={{ pushPopup, clearPopup }}>
      {children}
      {isPopupShowing && currentPopup && isCustomPopup && (
        <CustomPopupOverlay
          sandboxComponent={currentPopup.value as ReactNode}
        />
      )}
      {isPopupShowing && currentPopup && !isCustomPopup && (
        <GenericPopupOverlay {...(currentPopup.value as GenericPopupProps)} />
      )}
    </PopupContext.Provider>
  );
}

export default PopupProvider;

export { PopupContext };

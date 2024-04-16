import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import SquareImage from "../../generic/components/SquareImage";
import { StoreState } from "../../state/store";
import styles from "../styles/DiscoverBottomRight.module.css";
import DiscoverLikeButton from "./DiscoverLikeButton";
import { logout } from "../../client/client";
import { DiscoverBackgroundContext } from "./DiscoverBackgroundPanel";
import useSpotifyProfileResource from "../../resource-hooks/useSpotifyProfileResource";
import { AuthMode } from "../../state/slice.auth";

function DiscoverBottomRight() {
  const activeDeckItemCursor = useSelector<StoreState, number>(
    (state) => state.deckState.activeDeckItemCursor
  );
  const deckItem0 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem0
  );
  const deckItem1 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem1
  );
  const deckItem2 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem2
  );

  const [isShowingAccountActions, setIsShowingAccountActions] = useState(false);

  const profileResourceStatus = useSpotifyProfileResource();
  const profileImage = useSelector<StoreState, string>((state) =>
    state.userProfileState.data.images.length > 0
      ? state.userProfileState.data.images[0].url
      : ""
  );
  const profleUri = useSelector<StoreState, string>(
    (state) => state.userProfileState.data.uri
  );

  const artistImageContainerRef = useRef(null);
  const rightBottomRef: LegacyRef<HTMLDivElement> = useRef(null);

  const onClickOutside = useCallback(() => {
    setIsShowingAccountActions(false);
  }, []);

  const backgroundPanel = useContext(DiscoverBackgroundContext);
  useEffect(() => {
    backgroundPanel?.addEventListener("click", onClickOutside);
    return () => {
      backgroundPanel?.removeEventListener("click", onClickOutside);
    };
  }, [isShowingAccountActions]);

  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );

  return (
    <div className={styles.bottomRight}>
      <div className={styles.top}>
        <div ref={artistImageContainerRef} className={styles.artistImage}>
          {/* Swap chain here to optimize loading artist images */}
          <a
            className={`${styles.swapItem} ${
              activeDeckItemCursor === 0 ? `${styles.active}` : ""
            }`}
            href={`${
              deckItem0.artists.length > 0 ? deckItem0.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem0.artists.length > 0
                  ? deckItem0.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
              title={"Artist"}
            />
          </a>
          <a
            className={`${styles.swapItem} ${
              activeDeckItemCursor === 1 ? `${styles.active}` : ""
            }`}
            href={`${
              deckItem1.artists.length > 0 ? deckItem1.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem1.artists.length > 0
                  ? deckItem1.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
              title={"Artist"}
            />
          </a>
          <a
            className={`${styles.swapItem} ${
              activeDeckItemCursor === 2 ? `${styles.active}` : ""
            }`}
            href={`${
              deckItem2.artists.length > 0 ? deckItem2.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem2.artists.length > 0
                  ? deckItem2.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
              title={"Artist"}
            />
          </a>
        </div>
        <DiscoverLikeButton />
      </div>
      <div
        ref={rightBottomRef}
        className={styles.bottom}
        onClick={() => setIsShowingAccountActions((a) => !a)}
      >
        <SquareImage
          image={
            profileResourceStatus === "Loaded"
              ? profileImage
              : "/resources/fallback_square.svg"
          }
          containerRef={rightBottomRef}
          circleCrop
          forceIsWidthLimited
          title={"Account"}
        />
      </div>
      {isShowingAccountActions && (
        <div
          className={styles.accountActions}
          style={{ top: `${(rightBottomRef.current?.offsetTop ?? 0) - 80}px` }}
        >
          <div
            className={`${styles.accountAction} ${
              authMode === "Full" ? "" : "unauth-action"
            }`}
          >
            {authMode === "Full" && <a href={profleUri}>My Profile</a>}
            {authMode !== "Full" && "No Profile"}
          </div>
          <div className={styles.accountAction} onClick={() => logout()}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscoverBottomRight;

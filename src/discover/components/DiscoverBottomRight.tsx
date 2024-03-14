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
import "../styles/DiscoverBottomRight.scss";
import DiscoverLikeButton from "./DiscoverLikeButton";
import { useSpotifyProfileResource } from "../../utils/hooks";
import { logout } from "../../client/client";
import { InteractionPanelContext } from "../../utils/context";

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

  const interactionContainer = useContext(InteractionPanelContext);
  useEffect(() => {
    interactionContainer.addEventListener("click", onClickOutside);
    return () => {
      interactionContainer.removeEventListener("click", onClickOutside);
    };
  }, [isShowingAccountActions]);

  return (
    <div className="bottom-right">
      <div className="top">
        <div ref={artistImageContainerRef} className="artist-image">
          {/* Swap chain here to optimize loading artist images */}
          <a
            className={`swap-item ${
              activeDeckItemCursor === 0 ? "active" : ""
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
            className={`swap-item ${
              activeDeckItemCursor === 1 ? "active" : ""
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
            className={`swap-item ${
              activeDeckItemCursor === 2 ? "active" : ""
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
        className="bottom"
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
          className="account-actions"
          style={{ top: `${(rightBottomRef.current?.offsetTop ?? 0) - 80}px` }}
        >
          <a href={profleUri}>
            <div className="account-action">My Profile</div>
          </a>
          <div className="account-action" onClick={() => logout()}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscoverBottomRight;

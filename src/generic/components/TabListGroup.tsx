import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/TabListGroup.module.css";
import ImageTextListItem from "./ImageTextListItem";
import { remToPx } from "../../utils";

interface TabListItem {
  id: string;
  title: string;
  image: string;
  group: string;
}

interface Props<T> {
  items: T[];
  onClickItem: (item: T, isSelected: boolean) => void;
  selectedItem: T;
  useRoundedImage: (item: T) => boolean;
}

function TabListGroup<T extends TabListItem>({
  items,
  onClickItem,
  selectedItem,
  useRoundedImage,
}: Props<T>) {
  const tabMap: Map<string, T[]> = new Map();
  items.forEach((item) => {
    const list = tabMap.get(item.group) || [];
    list.push(item);
    if (!tabMap.has(item.group)) tabMap.set(item.group, list);
  });
  const tabArray: T[][] = [];
  tabMap.forEach((tabItems) => {
    tabArray.push(tabItems);
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectorWidth, setSelectorWidth] = useState(0);
  const [selectorTranslation, setSelectorTranslation] = useState(0);
  const tabRefs: React.MutableRefObject<HTMLDivElement[] | null[]> = useRef([]);

  useLayoutEffect(() => {
    const selectedTabRect =
      tabRefs.current[selectedTab]?.getBoundingClientRect();
    if (selectedTabRect) {
      setSelectorWidth(selectedTabRect.width);
    }

    var totalTranslation = 0;
    for (var i = 0; i < selectedTab; i++) {
      const tabRect = tabRefs.current[i]?.getBoundingClientRect();
      if (tabRect) {
        totalTranslation += tabRect.width + remToPx(1); //+1rem gap
      }
    }
    setSelectorTranslation(totalTranslation);
  }, [selectedTab, items]);

  useEffect(() => {
    if (selectedTab >= tabArray.length) {
      setSelectedTab(Math.max(tabArray.length - 1, 0)); //Makesure that an empty tab/non-existent tab does not remain selected.
    }
  }, [tabArray.length]);

  return (
    <div className={styles.tabListGroup}>
      <div className={styles.tabs}>
        {tabArray.map((tabItems, index) => {
          const tabName =
            tabItems[0]
              .group; /*If the tab exists then it has at least 1 item.*/
          const selected = index === selectedTab ? styles.selected : "";
          return (
            <div
              ref={(itemRef) => (tabRefs.current[index] = itemRef)}
              className={`${styles.tabItem} ${selected}`}
              onClick={() => setSelectedTab(index)}
              key={tabName}
            >
              {tabName}
            </div>
          );
        })}
      </div>
      <div className={styles.divider}></div>
      <div
        className={styles.selector}
        style={{
          width: `${selectorWidth}px`,
          translate: `${selectorTranslation}px 0px`,
        }}
      ></div>
      <div className={styles.list}>
        {tabArray.length > selectedTab &&
          tabArray[selectedTab].map((item) => {
            const isSelected = item.id === selectedItem.id;
            return (
              <ImageTextListItem
                key={item.id}
                image={item.image}
                text={item.title}
                imageType={useRoundedImage(item) ? "Rounded" : "Circle"}
                isSelected={isSelected}
                onClick={() => onClickItem(item, isSelected)}
              />
            );
          })}
      </div>
    </div>
  );
}

export default TabListGroup;

export { type TabListItem };

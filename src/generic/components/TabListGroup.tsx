import { useState } from "react";
import "../styles/TabListGroup.scss";

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
}

function TabListGroup<T extends TabListItem>({
  items,
  onClickItem,
  selectedItem,
}: Props<T>) {
  const tabSet: Set<string> = new Set();
  items.forEach((item) => tabSet.add(item.group));
  const tabGroups: T[][] = [];
  tabSet.forEach((tab) => {
    const tabItems = items.filter((item) => item.group === tab);
    tabGroups.push(tabItems);
  });
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="tab-list-group">
      <div className="tabs">
        {tabGroups.map((tabItems, index) => {
          const selected = index === selectedTab ? "selected" : "";
          return (
            <div
              className={`tab-item ${selected}`}
              onClick={() => setSelectedTab(index)}
              key={tabItems[0].group}
            >
              {
                tabItems[0]
                  .group /*If the tab exists then it has at least 1 item.*/
              }
            </div>
          );
        })}
      </div>
      <div className="list">
        {tabGroups.length > 0 &&
          tabGroups[selectedTab].map((item) => {
            const isSelected = item.id === selectedItem.id;
            const selected = isSelected ? "selected" : "";
            return (
              <div
                className={`list-item ${selected}`}
                onClick={() => onClickItem(item, isSelected)}
                key={item.id}
              >
                {item.title}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TabListGroup;

export { type TabListItem };

import { useState } from "react";
import "../styles/TabListGroup.scss";

interface TabListItem {
  id: string;
  title: string;
  image: string;
  group: string;
}

interface Props {
  items: TabListItem[];
  onClickItem: (item: TabListItem) => void;
}

function TabListGroup({ items, onClickItem }: Props) {
  const tabSet: Set<string> = new Set();
  items.forEach((item) => tabSet.add(item.group));
  const tabGroups: TabListItem[][] = [];
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
              className={`tab ${selected}`}
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
      <div className="tab-list">
        {tabGroups.length > 0 &&
          tabGroups[selectedTab].map((item) => (
            <div onClick={() => onClickItem(item)} key={item.id}>
              {item.title}
            </div>
          ))}
      </div>
    </div>
  );
}

export default TabListGroup;

export { type TabListItem };

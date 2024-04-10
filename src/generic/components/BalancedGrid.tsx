import "../styles/BalancedGrid.scss";
import IconTextGridItem from "./IconTextGridItem";
import ImageTextGridItem from "./ImageTextGridItem";

type GraphicType = "Image" | "Icon";

interface BalancedGridItem {
  id: string;
  title: string;
  image: string;
}

interface Props<T> {
  items: T[];
  onClickItem: (item: T, isSelected: boolean) => void;
  selectedItem: T;
  showSelectedItem: boolean;
  graphicType: GraphicType;
  className?: (item: T) => string;
}

function BalancedGrid<T extends BalancedGridItem>({
  items,
  onClickItem,
  selectedItem,
  showSelectedItem,
  graphicType,
  className,
}: Props<T>) {
  return (
    <div className="balanced-grid">
      {showSelectedItem && graphicType === "Image" && (
        <ImageTextGridItem
          key={selectedItem.id}
          image={selectedItem.image}
          text={selectedItem.title}
          isSelected={true}
          onAction={() => onClickItem(selectedItem, true)}
          useAvailableWidth={true}
          className={className ? className(selectedItem) : ""}
        />
      )}
      {showSelectedItem && graphicType === "Icon" && (
        <IconTextGridItem
          key={selectedItem.id}
          icon={selectedItem.image}
          text={selectedItem.title}
          isSelected={true}
          onAction={() => onClickItem(selectedItem, false)}
          useAvailableWidth={true}
          className={className ? className(selectedItem) : ""}
        />
      )}
      {items.map((item) => {
        const isSelected = item.id === selectedItem.id;
        return (
          !isSelected && (
            <div key={item.id}>
              {graphicType === "Image" && (
                <ImageTextGridItem
                  image={item.image}
                  text={item.title}
                  isSelected={false}
                  onAction={() => onClickItem(item, false)}
                  useAvailableWidth={true}
                  className={className ? className(item) : ""}
                />
              )}
              {graphicType === "Icon" && (
                <IconTextGridItem
                  icon={item.image}
                  text={item.title}
                  isSelected={false}
                  onAction={() => onClickItem(item, false)}
                  useAvailableWidth={true}
                  className={className ? className(item) : ""}
                />
              )}
            </div>
          )
        );
      })}
    </div>
  );
}

export default BalancedGrid;

export { type BalancedGridItem };

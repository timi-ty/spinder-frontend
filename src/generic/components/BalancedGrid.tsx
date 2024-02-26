import "../styles/BalancedGrid.scss";
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
  graphicType: GraphicType;
}

function BalancedGrid<T extends BalancedGridItem>({
  items,
  onClickItem,
  selectedItem,
  graphicType,
}: Props<T>) {
  return (
    <div className="balanced-grid">
      <ImageTextGridItem
        key={selectedItem.id}
        image={selectedItem.image}
        text={selectedItem.title}
        isSelected={true}
        onAction={() => onClickItem(selectedItem, true)}
        useAvailableWidth={true}
      />
      {items.map((item) => {
        const isSelected = item.id === selectedItem.id;
        return (
          !isSelected && (
            <ImageTextGridItem
              key={item.id}
              image={item.image}
              text={item.title}
              isSelected={false}
              onAction={() => onClickItem(item, false)}
              useAvailableWidth={true}
            />
          )
        );
      })}
    </div>
  );
}

export default BalancedGrid;

export { type BalancedGridItem };

import "../styles/BalancedGrid.scss";

interface BalancedGridItem {
  id: string;
  title: string;
  image: string;
}

interface Props<T> {
  items: T[];
  onClickItem: (item: T, isSelected: boolean) => void;
  selectedItem: T;
}

function BalancedGrid<T extends BalancedGridItem>({
  items,
  onClickItem,
  selectedItem,
}: Props<T>) {
  return (
    <div className="balanced-grid">
      {items.map((item) => {
        const isSelected = item.id === selectedItem.id;
        const selected = isSelected ? "selected" : "";
        return (
          <div
            key={item.id}
            className={`grid-item ${selected}`}
            onClick={() => onClickItem(item, isSelected)}
          >
            <div className="item-text">{item.title}</div>
          </div>
        );
      })}
    </div>
  );
}

export default BalancedGrid;

export { type BalancedGridItem };

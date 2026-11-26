import type { ClothingProduct } from "../data/data";
import ItemCard from "./ItemCard";

interface ItemsContainerProps {
  items: ClothingProduct[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onAddToCheckout: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function ItemsContainer({
  items,
  onIncrease,
  onDecrease,
  onAddToCheckout,
  onEdit,
  onDelete,
}: ItemsContainerProps) {
  return (
    <div>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onAddToCheckout={onAddToCheckout}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ItemsContainer;

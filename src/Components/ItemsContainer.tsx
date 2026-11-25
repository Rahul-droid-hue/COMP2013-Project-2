import type { ClothingProduct } from "../data/data";
import ItemCard from "./ItemCard";

interface ItemsContainerProps {
  items: ClothingProduct[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onAddToCheckout: (id: number) => void;
}

function ItemsContainer({
  items,
  onIncrease,
  onDecrease,
  onAddToCheckout,
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
        />
      ))}
    </div>
  );
}

export default ItemsContainer;

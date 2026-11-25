import type { ClothingProduct } from "../data/data";

interface ItemCardProps {
  item: ClothingProduct;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onAddToCheckout: (id: number) => void;
}

function ItemCard({
  item,
  onIncrease,
  onDecrease,
  onAddToCheckout,
}: ItemCardProps) {
  return (
    <div>
      <img src={item.image} alt={item.name} width="150" />

      <h3>{item.name}</h3>

      <p>Fit: {item.fit}</p>
      <p>Category: {item.category}</p>
      <p>Color: {item.color}</p>
      <p>Description: {item.description}</p>
      <p>Size: {item.size}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <p>Remaining Stock: {item.quantity}</p>

      {item.quantity === 0 ? (
        <p>Out of Stock</p>
      ) : (
        <div>
          <button
            onClick={() => onDecrease(item.id)}
            disabled={item.itemQuantity === 0}
          >
            -
          </button>

          <span> {item.itemQuantity} </span>

          <button
            onClick={() => onIncrease(item.id)}
            disabled={item.itemQuantity >= item.quantity}
          >
            +
          </button>
        </div>
      )}

      <button
        onClick={() => onAddToCheckout(item.id)}
        disabled={item.itemQuantity === 0 || item.quantity === 0}
      >
        Add to Checkout
      </button>
    </div>
  );
}

export default ItemCard;

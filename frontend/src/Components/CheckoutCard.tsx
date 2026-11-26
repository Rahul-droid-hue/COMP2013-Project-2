import type { ClothingProduct } from "../data/data";

interface CheckoutCardProps {
  item: ClothingProduct;
  onRemove: (id: number) => void;
}

function CheckoutCard({ item, onRemove }: CheckoutCardProps) {
  const subtotal = item.price * item.itemQuantity;

  return (
    <div>
      <img src={item.image} alt={item.name} width="100" />

      <h3>{item.name}</h3>

      <p>Unit Price: ${item.price.toFixed(2)}</p>
      <p>Quantity: {item.itemQuantity}</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>

      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
}

export default CheckoutCard;

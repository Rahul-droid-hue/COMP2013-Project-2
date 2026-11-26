import type { ClothingProduct } from "../data/data";
import CheckoutCard from "./CheckoutCard";

interface CheckoutContainerProps {
  items: ClothingProduct[];
  onRemove: (id: number) => void;
  onEmpty: () => void;
}

function CheckoutContainer({
  items,
  onRemove,
  onEmpty,
}: CheckoutContainerProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.itemQuantity,
    0,
  );

  return (
    <div id="mycart">
      <h2>Checkout</h2>

      {items.length === 0 ? (
        <p>Your Cart is Empty</p>
      ) : (
        <div>
          {items.map((item) => (
            <CheckoutCard key={item.id} item={item} onRemove={onRemove} />
          ))}

          <button onClick={onEmpty}>Empty Checkout</button>
        </div>
      )}

      <h3>Grand Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

export default CheckoutContainer;

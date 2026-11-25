import { useState } from "react";
import type { ClothingProduct } from "../data/data";
import ItemsContainer from "./ItemsContainer";
import CheckoutContainer from "./CheckoutContainer";
import NavBar from "./NavBar";

interface ThriftHappensProps {
  data: ClothingProduct[];
}

function ThriftHappens({ data }: ThriftHappensProps) {
  const [items, setItems] = useState<ClothingProduct[]>(data);
  const [cartItems, setCartItems] = useState<ClothingProduct[]>([]);

  // Increase the selected quantity
  const handleIncrease = (id: number) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id && item.itemQuantity < item.quantity
          ? { ...item, itemQuantity: item.itemQuantity + 1 }
          : item,
      ),
    );
  };

  // Decrease the selected quantity
  const handleDecrease = (id: number) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id && item.itemQuantity > 0
          ? { ...item, itemQuantity: item.itemQuantity - 1 }
          : item,
      ),
    );
  };

  // Add selected products to checkout
  const handleAddToCheckout = (id: number) => {
    const selectedItem = items.find((item) => item.id === id);

    if (
      !selectedItem ||
      selectedItem.itemQuantity <= 0 ||
      selectedItem.itemQuantity > selectedItem.quantity
    ) {
      return;
    }

    setCartItems((previousCart) => {
      const existingItem = previousCart.find((item) => item.id === id);

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === id
            ? {
                ...item,
                itemQuantity: item.itemQuantity + selectedItem.itemQuantity,
              }
            : item,
        );
      }

      return [...previousCart, { ...selectedItem }];
    });

    // Reduce stock and reset the selection
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - selectedItem.itemQuantity,
              itemQuantity: 0,
            }
          : item,
      ),
    );
  };

  // Remove one product from checkout and restore its stock
  const handleRemoveFromCheckout = (id: number) => {
    const removedItem = cartItems.find((item) => item.id === id);

    if (!removedItem) {
      return;
    }

    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + removedItem.itemQuantity,
            }
          : item,
      ),
    );

    setCartItems((previousCart) =>
      previousCart.filter((item) => item.id !== id),
    );
  };

  // Empty checkout and restore all purchased quantities
  const handleEmptyCheckout = () => {
    setItems((previousItems) =>
      previousItems.map((item) => {
        const cartItem = cartItems.find(
          (cartProduct) => cartProduct.id === item.id,
        );

        return cartItem
          ? {
              ...item,
              quantity: item.quantity + cartItem.itemQuantity,
            }
          : item;
      }),
    );

    setCartItems([]);
  };

  return (
    <div>
      <NavBar />

      <ItemsContainer
        items={items}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onAddToCheckout={handleAddToCheckout}
      />

      <CheckoutContainer
        items={cartItems}
        onRemove={handleRemoveFromCheckout}
        onEmpty={handleEmptyCheckout}
      />
    </div>
  );
}

export default ThriftHappens;

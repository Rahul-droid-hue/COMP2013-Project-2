import { useState, useEffect } from "react";
import axios from "axios";
import type { ClothingProduct } from "../data/data";
import ItemsContainer from "./ItemsContainer";
import CheckoutContainer from "./CheckoutContainer";
import NavBar from "./NavBar";
import FormComponent from "./FormComponent";

function ThriftHappens() {
  const [items, setItems] = useState<ClothingProduct[]>([]);
  const [cartItems, setCartItems] = useState<ClothingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState<ClothingProduct | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  // Get all clothing products from the backend
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get<ClothingProduct[]>(
          "http://localhost:5000/data",
        );

        setItems(response.data);
      } catch {
        setError("Failed to load products from the server.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Refresh the catalogue after adding, editing or deleting
  const handleSaved = async () => {
    try {
      const response = await axios.get<ClothingProduct[]>(
        "http://localhost:5000/data",
      );

      setItems((previousItems) =>
        response.data.map((product) => {
          const previousProduct = previousItems.find(
            (item) => item.id === product.id,
          );

          const cartProduct = cartItems.find((item) => item.id === product.id);

          // Keep quantities already reserved in checkout
          const reservedQuantity = cartProduct?.itemQuantity ?? 0;

          const availableQuantity = Math.max(
            0,
            product.quantity - reservedQuantity,
          );

          return {
            ...product,
            quantity: availableQuantity,
            itemQuantity: Math.min(
              previousProduct?.itemQuantity ?? 0,
              availableQuantity,
            ),
          };
        }),
      );

      setError("");
    } catch {
      setError("Failed to refresh products from the server.");
    }
  };

  // Select a product to edit
  const handleEdit = (id: number) => {
    const selectedItem = items.find((item) => item.id === id);

    if (!selectedItem) {
      return;
    }

    // Do not edit a product currently in checkout
    const inCart = cartItems.some((item) => item.id === id);

    if (inCart) {
      setActionMessage("Remove this product from checkout before editing it.");
      return;
    }

    setEditingItem(selectedItem);
    setActionMessage("");
  };

  // Delete a clothing product from MongoDB
  const handleDelete = async (id: number) => {
    // Do not delete products currently in checkout
    const inCart = cartItems.some((item) => item.id === id);

    if (inCart) {
      setActionMessage("Remove this product from checkout before deleting it.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/data/${id}`);

      // Clear the edit selection if this product was being edited
      if (editingItem?.id === id) {
        setEditingItem(null);
      }

      // Refresh the catalogue after deleting
      await handleSaved();

      setActionMessage("Product deleted successfully!");
    } catch {
      setActionMessage("Failed to delete product.");
    }
  };

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

      <FormComponent
        key={editingItem?.id ?? "add"}
        editingItem={editingItem}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingItem(null)}
      />

      {actionMessage && <p>{actionMessage}</p>}

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>No products available.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ItemsContainer
          items={items}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onAddToCheckout={handleAddToCheckout}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CheckoutContainer
        items={cartItems}
        onRemove={handleRemoveFromCheckout}
        onEmpty={handleEmptyCheckout}
      />
    </div>
  );
}

export default ThriftHappens;

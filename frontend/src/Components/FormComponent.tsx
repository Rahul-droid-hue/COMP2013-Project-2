import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import type { ClothingProduct } from "../data/data";

interface FormComponentProps {
  editingItem: ClothingProduct | null;
  onSaved: () => void;
  onCancelEdit: () => void;
}

const emptyForm = {
  name: "",
  image: "",
  fit: "",
  category: "",
  color: "",
  description: "",
  size: "",
  price: "",
  quantity: "",
};

// Set the starting values for adding or editing a product
function getInitialForm(editingItem: ClothingProduct | null) {
  if (editingItem) {
    return {
      name: editingItem.name,
      image: editingItem.image,
      fit: editingItem.fit,
      category: editingItem.category,
      color: editingItem.color,
      description: editingItem.description,
      size: editingItem.size,
      price: String(editingItem.price),
      quantity: String(editingItem.quantity),
    };
  }

  return { ...emptyForm };
}

function FormComponent({
  editingItem,
  onSaved,
  onCancelEdit,
}: FormComponentProps) {
  const [formData, setFormData] = useState(() => getInitialForm(editingItem));

  const [message, setMessage] = useState("");

  // Update the form state when an input changes
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update a product
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const textFields = [
      formData.name,
      formData.image,
      formData.fit,
      formData.category,
      formData.color,
      formData.description,
      formData.size,
    ];

    if (textFields.some((value) => value.trim() === "")) {
      setMessage("Please fill in all fields.");
      return;
    }

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (
      formData.price.trim() === "" ||
      formData.quantity.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setMessage("Enter a valid price and stock quantity.");
      return;
    }

    const productData = {
      name: formData.name,
      image: formData.image,
      fit: formData.fit,
      category: formData.category,
      color: formData.color,
      description: formData.description,
      size: formData.size,
      price: price,
      quantity: quantity,
    };

    try {
      if (editingItem) {
        // Update an existing product
        await axios.patch(
          `http://localhost:5000/data/${editingItem.id}`,
          productData,
        );

        setMessage("Product updated successfully!");
        onCancelEdit();
      } else {
        // Add a new product
        await axios.post("http://localhost:5000/data", productData);

        setMessage("Product added successfully!");
      }

      setFormData({ ...emptyForm });
      onSaved();
    } catch {
      setMessage("Failed to save product.");
    }
  };

  return (
    <div>
      <h2>{editingItem ? "Edit Clothing Item" : "Add Clothing Item"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image Path"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <select
          name="fit"
          value={formData.fit}
          onChange={handleChange}
          required
        >
          <option value="">Select Fit</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="shirt">Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="pants">Pants</option>
          <option value="shorts">Shorts</option>
        </select>

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
        >
          <option value="">Select Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Stock Quantity"
          min="0"
          step="1"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingItem ? "Update Product" : "Add Product"}
        </button>

        {editingItem && (
          <button type="button" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FormComponent;

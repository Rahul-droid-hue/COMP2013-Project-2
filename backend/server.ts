import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ClothesItem from "./models/clothesItem";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the React frontend
app.use(cors());

// Allow the backend to receive JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Thrift Happens API is running" });
});

// Get all clothing products from MongoDB
app.get("/data", async (req, res) => {
  try {
    const products = await ClothesItem.find().sort({ id: 1 });

    res.status(200).json(products);
  } catch (error) {
    console.log("Error getting products:", error);

    res.status(500).json({
      message: "Failed to get products",
    });
  }
});

// Add a new clothing product to MongoDB
app.post("/data", async (req, res) => {
  try {
    const {
      name,
      image,
      fit,
      category,
      color,
      description,
      size,
      price,
      quantity,
    } = req.body;

    // Check that the text fields are filled in
    const textFields = [name, image, fit, category, color, description, size];

    if (
      textFields.some(
        (value) => typeof value !== "string" || value.trim() === "",
      )
    ) {
      res.status(400).json({
        message: "All text fields are required",
      });
      return;
    }

    // Check price and stock quantity
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      res.status(400).json({
        message: "Price and quantity must be valid nonnegative numbers",
      });
      return;
    }

    // Find the highest existing product ID
    const lastItem = await ClothesItem.findOne().sort({ id: -1 });

    const newId = lastItem ? lastItem.id + 1 : 0;

    // Save the new product in MongoDB
    const newProduct = await ClothesItem.create({
      id: newId,
      name,
      image,
      fit,
      category,
      color,
      description,
      size,
      price,
      quantity,
      itemQuantity: 0,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Error creating product:", error);

    if (error instanceof Error && "code" in error && error.code === 11000) {
      res.status(409).json({
        message: "Product ID already exists",
      });
      return;
    }

    res.status(500).json({
      message: "Failed to create product",
    });
  }
});

// Update an existing clothing product
app.patch("/data/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const updates = req.body;

    // Check if the product ID is valid
    if (!Number.isInteger(productId) || productId < 0) {
      res.status(400).json({
        message: "Invalid product ID",
      });
      return;
    }

    // Check if the request contains an object
    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      res.status(400).json({
        message: "Invalid product data",
      });
      return;
    }

    // Only allow clothing details to be edited
    const allowedFields = [
      "name",
      "image",
      "fit",
      "category",
      "color",
      "description",
      "size",
      "price",
      "quantity",
    ];

    const fields = Object.keys(updates);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        message: "Invalid fields to update",
      });
      return;
    }

    // Validate text fields
    const textFields = [
      "name",
      "image",
      "fit",
      "category",
      "color",
      "description",
      "size",
    ];

    for (const field of textFields) {
      if (
        field in updates &&
        (typeof updates[field] !== "string" || updates[field].trim() === "")
      ) {
        res.status(400).json({
          message: "Invalid text field",
        });
        return;
      }
    }

    // Validate price
    if (
      "price" in updates &&
      (typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0)
    ) {
      res.status(400).json({
        message: "Invalid price",
      });
      return;
    }

    // Validate stock quantity
    if (
      "quantity" in updates &&
      (!Number.isInteger(updates.quantity) || updates.quantity < 0)
    ) {
      res.status(400).json({
        message: "Invalid quantity",
      });
      return;
    }

    // Find the product by numeric ID and update it
    const updatedProduct = await ClothesItem.findOneAndUpdate(
      { id: productId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    // Product does not exist
    if (!updatedProduct) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error updating product:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
});

// Delete a clothing product from MongoDB
app.delete("/data/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Check if the product ID is valid
    if (!Number.isInteger(productId) || productId < 0) {
      res.status(400).json({
        message: "Invalid product ID",
      });
      return;
    }

    // Find and delete the product using its numeric ID
    const deletedProduct = await ClothesItem.findOneAndDelete({
      id: productId,
    });

    // Check if the product exists
    if (!deletedProduct) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // Return a success message
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.log("Error deleting product:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.log("MONGO_URI is missing from .env");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("MongoDB connection failed:", error);
  }
}

startServer();

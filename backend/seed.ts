import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import ClothesItem from "./models/clothesItem";

dotenv.config();

// Read the original 50 products from data.json
const products = JSON.parse(readFileSync("./data.json", "utf8"));

async function seedProducts() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.log("MONGO_URI is missing from .env");
      return;
    }

    // Connect to MongoDB Atlas
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB!");

    // Add each product if its ID does not already exist
    for (const product of products) {
      await ClothesItem.updateOne(
        { id: product.id },
        { $setOnInsert: product },
        { upsert: true },
      );
    }

    console.log("All 50 products have been processed!");
  } catch (error) {
    console.log("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();

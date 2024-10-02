import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
const app = express();
dotenv.config();
app.use(express.json()); //allows us to accept json data in the body

app.get("/", (req, res) => {
  res.send("server is ready");
});
app.get("products", async (req, res) => {
  try {
    const products = await Product.find({}); //empty object means fetching all the obj in db
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in fetching products", error.message);
    res.status(500).json({ message: "Server error", success: false });
  }
});
app.post("/products", async (req, res) => {
  const product = req.body; //user will send this data
  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all fields" });
  }
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct }); //201 means something is created
  } catch (error) {
    console.log("Error in create product", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});

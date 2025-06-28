import express from "express";
import categories from "./routes/categories.route";
import users from "./routes/users.route";
import auth from "./routes/auth.route";
import brands from "./routes/brands.route";
import products from "./routes/products.route";
import upload from "./routes/upload.route";
import payment from "./routes/payments.route";
import orders from "./routes/orders.route";
import orderDetails from "./routes/orderDetails.route";
import promotions from "./routes/promotion.route";
import addresses from "./routes/addresses.route";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/v1/", categories);
app.use("/api/v1/", users);
app.use("/api/v1/", auth);
app.use("/api/v1/", brands);
app.use("/api/v1/", products);
app.use("/api/v1/", upload);
app.use("/api/v1/", payment);
app.use("/api/v1/", orders);
app.use("/api/v1/", orderDetails);
app.use("/api/v1/", promotions);
app.use("/api/v1/", addresses);

app.use(express.static(path.join(__dirname, "../public")));
export default app;

// ============================================
//   DOSTAVKA ILOVASI — Backend API
//   Node.js + Express + In-Memory Database
// ============================================
//
//  O'rnatish:
//    npm init -y
//    npm install express cors uuid
//    node server.js
//
//  Server: http://localhost:3000
// ============================================

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// 🗄️  MA'LUMOTLAR BAZASI (In-Memory)
//     Haqiqiy loyihada PostgreSQL ishlating
// ============================================

let users = [
  { id: "u1", name: "Jasur Toshmatov", phone: "+998901234567", role: "customer", address: "Chilonzor, 12-kvartal" },
  { id: "u2", name: "Ali Karimov",     phone: "+998907654321", role: "courier",  status: "active" },
  { id: "u3", name: "Baxt Oshxonasi",  phone: "+998901111111", role: "store" },
];

let stores = [
  { id: "s1", name: "Baxt Oshxonasi",   address: "Chilonzor, 12-kvartal", rating: 4.8, emoji: "🍲", category: "O'zbek taomi",      deliveryFee: 3000, deliveryTime: "25-35" },
  { id: "s2", name: "Toshkent Lazzat",  address: "Yunusobod, 19-mavze",   rating: 4.5, emoji: "🍢", category: "Milliy taomlar",    deliveryFee: 2000, deliveryTime: "30-45" },
  { id: "s3", name: "Fast Burger",      address: "Mirzo Ulug'bek, 5-uy",  rating: 4.2, emoji: "🍔", category: "Fastfood",          deliveryFee: 4000, deliveryTime: "15-25" },
];

let products = [
  { id: "p1", storeId: "s1", name: "Osh",      price: 25000, stock: 12, emoji: "🍲", category: "Asosiy taom" },
  { id: "p2", storeId: "s1", name: "Somsa",    price:  8000, stock: 30, emoji: "🥟", category: "Non mahsuloti" },
  { id: "p3", storeId: "s1", name: "Lag'mon",  price: 22000, stock:  8, emoji: "🍜", category: "Asosiy taom" },
  { id: "p4", storeId: "s2", name: "Shashlik", price: 35000, stock: 15, emoji: "🍢", category: "Go'sht" },
  { id: "p5", storeId: "s2", name: "Manti",    price: 18000, stock:  3, emoji: "🥟", category: "Asosiy taom" },
  { id: "p6", storeId: "s3", name: "Burger",   price: 30000, stock: 20, emoji: "🍔", category: "Fastfood" },
  { id: "p7", storeId: "s3", name: "Fri",      price: 12000, stock: 40, emoji: "🍟", category: "Fastfood" },
];

let orders = [
  {
    id: "o1",
    customerId: "u1",
    storeId: "s1",
    courierId: "u2",
    items: [{ productId: "p1", name: "Osh", qty: 1, price: 25000 }],
    total: 28000,
    deliveryFee: 3000,
    address: "Amir Temur ko'chasi, 45",
    status: "delivered", // pending | accepted | preparing | on_the_way | delivered | cancelled
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// ============================================
// 🛠️  HELPER FUNKSIYALAR
// ============================================

const findById = (arr, id) => arr.find(item => item.id === id);
const notFound = (res, msg) => res.status(404).json({ success: false, message: msg });
const badRequest = (res, msg) => res.status(400).json({ success: false, message: msg });
const success = (res, data, status = 200) => res.status(status).json({ success: true, data });

// ============================================
// 🏥  HEALTH CHECK
// ============================================

// GET /
app.get("/", (req, res) => {
  res.json({
    name: "Dostavka API",
    version: "1.0.0",
    status: "running ✅",
    endpoints: {
      stores:   "/api/stores",
      products: "/api/products",
      orders:   "/api/orders",
      users:    "/api/users",
      couriers: "/api/couriers",
    },
  });
});

// ============================================
// 👤  FOYDALANUVCHILAR (Users)
// ============================================

// GET /api/users — Barcha foydalanuvchilar
app.get("/api/users", (req, res) => {
  const { role } = req.query;
  const result = role ? users.filter(u => u.role === role) : users;
  success(res, result);
});

// GET /api/users/:id — Bitta foydalanuvchi
app.get("/api/users/:id", (req, res) => {
  const user = findById(users, req.params.id);
  if (!user) return notFound(res, "Foydalanuvchi topilmadi");
  success(res, user);
});

// POST /api/users — Yangi foydalanuvchi qo'shish
app.post("/api/users", (req, res) => {
  const { name, phone, role, address } = req.body;
  if (!name || !phone || !role) return badRequest(res, "name, phone, role majburiy");
  const user = { id: uuidv4(), name, phone, role, address: address || "", createdAt: new Date().toISOString() };
  users.push(user);
  success(res, user, 201);
});

// ============================================
// 🏪  DO'KONLAR (Stores)
// ============================================

// GET /api/stores — Barcha do'konlar
app.get("/api/stores", (req, res) => {
  const { category } = req.query;
  const result = category ? stores.filter(s => s.category === category) : stores;
  success(res, result);
});

// GET /api/stores/:id — Bitta do'kon
app.get("/api/stores/:id", (req, res) => {
  const store = findById(stores, req.params.id);
  if (!store) return notFound(res, "Do'kon topilmadi");
  success(res, store);
});

// POST /api/stores — Yangi do'kon qo'shish
app.post("/api/stores", (req, res) => {
  const { name, address, category, deliveryFee, deliveryTime, emoji } = req.body;
  if (!name || !address) return badRequest(res, "name va address majburiy");
  const store = {
    id: uuidv4(), name, address, category: category || "Boshqa",
    deliveryFee: deliveryFee || 3000, deliveryTime: deliveryTime || "30-45",
    emoji: emoji || "🏪", rating: 0, createdAt: new Date().toISOString(),
  };
  stores.push(store);
  success(res, store, 201);
});

// PUT /api/stores/:id — Do'kon ma'lumotlarini yangilash
app.put("/api/stores/:id", (req, res) => {
  const idx = stores.findIndex(s => s.id === req.params.id);
  if (idx === -1) return notFound(res, "Do'kon topilmadi");
  stores[idx] = { ...stores[idx], ...req.body, id: stores[idx].id };
  success(res, stores[idx]);
});

// DELETE /api/stores/:id — Do'konni o'chirish
app.delete("/api/stores/:id", (req, res) => {
  const idx = stores.findIndex(s => s.id === req.params.id);
  if (idx === -1) return notFound(res, "Do'kon topilmadi");
  stores.splice(idx, 1);
  success(res, { message: "Do'kon o'chirildi" });
});

// ============================================
// 📦  MAHSULOTLAR (Products)
// ============================================

// GET /api/products — Barcha mahsulotlar
// GET /api/products?storeId=s1 — Do'kon mahsulotlari
app.get("/api/products", (req, res) => {
  const { storeId, category } = req.query;
  let result = [...products];
  if (storeId) result = result.filter(p => p.storeId === storeId);
  if (category) result = result.filter(p => p.category === category);
  success(res, result);
});

// GET /api/products/:id — Bitta mahsulot
app.get("/api/products/:id", (req, res) => {
  const product = findById(products, req.params.id);
  if (!product) return notFound(res, "Mahsulot topilmadi");
  success(res, product);
});

// POST /api/products — Yangi mahsulot qo'shish (Do'kon uchun)
app.post("/api/products", (req, res) => {
  const { storeId, name, price, stock, category, emoji } = req.body;
  if (!storeId || !name || !price) return badRequest(res, "storeId, name, price majburiy");
  if (!findById(stores, storeId)) return notFound(res, "Do'kon topilmadi");
  const product = {
    id: uuidv4(), storeId, name, price: Number(price),
    stock: Number(stock) || 0, category: category || "Boshqa",
    emoji: emoji || "🍽️", createdAt: new Date().toISOString(),
  };
  products.push(product);
  success(res, product, 201);
});

// PUT /api/products/:id — Mahsulotni yangilash
app.put("/api/products/:id", (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return notFound(res, "Mahsulot topilmadi");
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  success(res, products[idx]);
});

// PATCH /api/products/:id/stock — Zaxirani yangilash (Kuryer uchun)
app.patch("/api/products/:id/stock", (req, res) => {
  const { delta } = req.body; // +5 yoki -3
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return notFound(res, "Mahsulot topilmadi");
  if (delta === undefined) return badRequest(res, "delta majburiy (masalan: +5 yoki -3)");
  products[idx].stock = Math.max(0, products[idx].stock + Number(delta));
  success(res, products[idx]);
});

// DELETE /api/products/:id — Mahsulotni o'chirish
app.delete("/api/products/:id", (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return notFound(res, "Mahsulot topilmadi");
  products.splice(idx, 1);
  success(res, { message: "Mahsulot o'chirildi" });
});

// ============================================
// 🛒  BUYURTMALAR (Orders)
// ============================================

// GET /api/orders — Barcha buyurtmalar
// GET /api/orders?customerId=u1 — Mijoz buyurtmalari
// GET /api/orders?courierId=u2 — Kuryer buyurtmalari
// GET /api/orders?storeId=s1  — Do'kon buyurtmalari
// GET /api/orders?status=pending — Holat bo'yicha
app.get("/api/orders", (req, res) => {
  const { customerId, courierId, storeId, status } = req.query;
  let result = [...orders];
  if (customerId) result = result.filter(o => o.customerId === customerId);
  if (courierId)  result = result.filter(o => o.courierId === courierId);
  if (storeId)    result = result.filter(o => o.storeId === storeId);
  if (status)     result = result.filter(o => o.status === status);
  // Yangi buyurtmalar avval
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  success(res, result);
});

// GET /api/orders/:id — Bitta buyurtma
app.get("/api/orders/:id", (req, res) => {
  const order = findById(orders, req.params.id);
  if (!order) return notFound(res, "Buyurtma topilmadi");

  // To'liq ma'lumot bilan qaytarish
  const enriched = {
    ...order,
    customer: findById(users, order.customerId),
    store:    findById(stores, order.storeId),
    courier:  order.courierId ? findById(users, order.courierId) : null,
  };
  success(res, enriched);
});

// POST /api/orders — Yangi buyurtma berish (Mijoz uchun)
app.post("/api/orders", (req, res) => {
  const { customerId, storeId, items, address } = req.body;

  // Tekshirish
  if (!customerId || !storeId || !items || !address)
    return badRequest(res, "customerId, storeId, items, address majburiy");
  if (!Array.isArray(items) || items.length === 0)
    return badRequest(res, "items bo'sh bo'lmasin");
  if (!findById(users, customerId))  return notFound(res, "Foydalanuvchi topilmadi");
  if (!findById(stores, storeId))    return notFound(res, "Do'kon topilmadi");

  // Narxlarni hisoblash va zaxirani tekshirish
  let total = 0;
  const enrichedItems = [];

  for (const item of items) {
    const product = findById(products, item.productId);
    if (!product) return notFound(res, `Mahsulot topilmadi: ${item.productId}`);
    if (product.stock < item.qty) return badRequest(res, `Zaxira yetarli emas: ${product.name}`);
    enrichedItems.push({ productId: product.id, name: product.name, qty: item.qty, price: product.price });
    total += product.price * item.qty;
  }

  // Zaxirani kamaytirish
  for (const item of items) {
    const idx = products.findIndex(p => p.id === item.productId);
    products[idx].stock -= item.qty;
  }

  const store = findById(stores, storeId);
  const order = {
    id: uuidv4(),
    customerId, storeId,
    courierId: null,
    items: enrichedItems,
    total: total + store.deliveryFee,
    deliveryFee: store.deliveryFee,
    address,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  success(res, order, 201);
});

// PATCH /api/orders/:id/status — Holat o'zgartirish
//   Kuryer: pending → accepted → on_the_way → delivered
//   Do'kon: pending → preparing
//   Har kim: → cancelled
app.patch("/api/orders/:id/status", (req, res) => {
  const { status, courierId } = req.body;
  const validStatuses = ["pending", "accepted", "preparing", "on_the_way", "delivered", "cancelled"];

  if (!validStatuses.includes(status))
    return badRequest(res, `Status noto'g'ri. Mumkin: ${validStatuses.join(", ")}`);

  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return notFound(res, "Buyurtma topilmadi");

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  if (courierId) orders[idx].courierId = courierId;

  success(res, orders[idx]);
});

// DELETE /api/orders/:id — Buyurtmani bekor qilish
app.delete("/api/orders/:id", (req, res) => {
  const order = findById(orders, req.params.id);
  if (!order) return notFound(res, "Buyurtma topilmadi");
  if (order.status === "delivered") return badRequest(res, "Yetkazilgan buyurtmani bekor qilib bo'lmaydi");
  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();
  success(res, { message: "Buyurtma bekor qilindi" });
});

// ============================================
// 🚴  KURYER (Couriers)
// ============================================

// GET /api/couriers — Barcha kurye'rlar
app.get("/api/couriers", (req, res) => {
  const couriers = users.filter(u => u.role === "courier");
  success(res, couriers);
});

// GET /api/couriers/:id/orders — Kuryer buyurtmalari
app.get("/api/couriers/:id/orders", (req, res) => {
  const courier = findById(users, req.params.id);
  if (!courier || courier.role !== "courier") return notFound(res, "Kuryer topilmadi");
  const courierOrders = orders.filter(o => o.courierId === req.params.id || o.status === "pending");
  success(res, courierOrders);
});

// PATCH /api/couriers/:id/status — Kuryer holatini yangilash (active/inactive)
app.patch("/api/couriers/:id/status", (req, res) => {
  const { status } = req.body;
  const idx = users.findIndex(u => u.id === req.params.id && u.role === "courier");
  if (idx === -1) return notFound(res, "Kuryer topilmadi");
  users[idx].status = status;
  success(res, users[idx]);
});

// ============================================
// 📊  STATISTIKA
// ============================================

// GET /api/stats — Umumiy statistika
app.get("/api/stats", (req, res) => {
  success(res, {
    totalStores:    stores.length,
    totalProducts:  products.length,
    totalOrders:    orders.length,
    totalUsers:     users.length,
    activeOrders:   orders.filter(o => !["delivered", "cancelled"].includes(o.status)).length,
    deliveredToday: orders.filter(o => o.status === "delivered").length,
    revenue:        orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0),
    lowStockProducts: products.filter(p => p.stock < 5).length,
  });
});

// ============================================
// 🚀  SERVER ISHGA TUSHIRISH
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ✅  Dostavka API ishga tushdi!
  🌐  URL: http://localhost:${PORT}
  
  📋  Endpointlar:
  ├── GET    /api/stores
  ├── POST   /api/stores
  ├── GET    /api/products?storeId=s1
  ├── POST   /api/products
  ├── PATCH  /api/products/:id/stock
  ├── GET    /api/orders?status=pending
  ├── POST   /api/orders
  ├── PATCH  /api/orders/:id/status
  ├── GET    /api/couriers
  └── GET    /api/stats
  `);
});

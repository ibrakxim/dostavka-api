# 🚀 Dostavka API — Qo'llanma

## O'rnatish

```bash
# 1. Papka yarating
mkdir dostavka-api
cd dostavka-api

# 2. server.js faylini shu papkaga ko'chiring

# 3. Kerakli paketlarni o'rnating
npm init -y
npm install express cors uuid

# 4. Serverni ishga tushiring
node server.js
```

Server: **http://localhost:3000**

---

## 📋 Barcha Endpointlar

### 🏪 Do'konlar
| Method | URL | Nima qiladi |
|--------|-----|-------------|
| GET | /api/stores | Barcha do'konlar |
| GET | /api/stores/:id | Bitta do'kon |
| POST | /api/stores | Yangi do'kon |
| PUT | /api/stores/:id | Do'konni yangilash |
| DELETE | /api/stores/:id | Do'konni o'chirish |

### 📦 Mahsulotlar
| Method | URL | Nima qiladi |
|--------|-----|-------------|
| GET | /api/products | Barcha mahsulotlar |
| GET | /api/products?storeId=s1 | Do'kon mahsulotlari |
| POST | /api/products | Yangi mahsulot |
| PUT | /api/products/:id | Mahsulotni yangilash |
| PATCH | /api/products/:id/stock | Zaxirani yangilash |
| DELETE | /api/products/:id | Mahsulotni o'chirish |

### 🛒 Buyurtmalar
| Method | URL | Nima qiladi |
|--------|-----|-------------|
| GET | /api/orders | Barcha buyurtmalar |
| GET | /api/orders?customerId=u1 | Mijoz buyurtmalari |
| GET | /api/orders?status=pending | Holat bo'yicha |
| POST | /api/orders | Yangi buyurtma |
| PATCH | /api/orders/:id/status | Holat o'zgartirish |

### 🚴 Kuryer
| Method | URL | Nima qiladi |
|--------|-----|-------------|
| GET | /api/couriers | Barcha kurye'rlar |
| GET | /api/couriers/:id/orders | Kuryer buyurtmalari |
| PATCH | /api/couriers/:id/status | Holat yangilash |

### 📊 Statistika
| Method | URL | Nima qiladi |
|--------|-----|-------------|
| GET | /api/stats | Umumiy statistika |

---

## 💡 Misol so'rovlar

### Yangi buyurtma berish (Mijoz)
```json
POST /api/orders
{
  "customerId": "u1",
  "storeId": "s1",
  "address": "Amir Temur ko'chasi, 45",
  "items": [
    { "productId": "p1", "qty": 1 },
    { "productId": "p2", "qty": 2 }
  ]
}
```

### Buyurtmani qabul qilish (Kuryer)
```json
PATCH /api/orders/o1/status
{
  "status": "accepted",
  "courierId": "u2"
}
```

### Zaxirani yangilash (Do'kon)
```json
PATCH /api/products/p1/stock
{
  "delta": -5
}
```

---

## 📊 Buyurtma holatlari

```
pending → accepted → preparing → on_the_way → delivered
                                             → cancelled
```

---

## 🔜 Keyingi qadamlar

1. **PostgreSQL** — ma'lumotlarni doimiy saqlash
2. **JWT Auth** — foydalanuvchi autentifikatsiyasi
3. **Socket.io** — real-time kuzatish
4. **Railway.app** — serverga deploy qilish

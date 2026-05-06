# 🚀 Dostavka API — Deploy Qo'llanmasi
# Railway.app orqali bepul internetga chiqarish

## ✅ 1-QADAM: Papka tayyorlash

Kompyuteringizda yangi papka yarating:

```
dostavka-api/
├── server.js        ← backend fayli
├── package.json     ← (quyida yaratamiz)
└── .gitignore       ← (quyida yaratamiz)
```

---

## ✅ 2-QADAM: package.json yaratish

`dostavka-api` papkasida terminal oching va yozing:

```bash
npm init -y
npm install express cors uuid
```

Keyin `package.json` faylini oching va `"scripts"` qismini o'zgartiring:

```json
"scripts": {
  "start": "node server.js"
}
```

---

## ✅ 3-QADAM: .gitignore yaratish

`dostavka-api` papkasida `.gitignore` fayl yarating va ichiga yozing:

```
node_modules
.env
```

---

## ✅ 4-QADAM: GitHub ga yuklash

Terminalni oching, `dostavka-api` papkasiga kiring:

```bash
# Git boshlash
git init

# Hamma fayllarni qo'shish
git add .

# Saqlash
git commit -m "Dostavka API - birinchi versiya"
```

Keyin GitHub.com ga kiring:
1. **"New repository"** bosing
2. Nom: `dostavka-api`
3. **"Create repository"** bosing
4. Ochilgan sahifada ko'rsatilgan buyruqlarni terminarga kiriting:

```bash
git remote add origin https://github.com/SIZNING_NOMINGIZ/dostavka-api.git
git branch -M main
git push -u origin main
```

---

## ✅ 5-QADAM: Railway.app ga deploy

1. **railway.app** saytiga kiring
2. **"Start a New Project"** bosing
3. **"Deploy from GitHub repo"** tanlang
4. GitHub akkauntingizni ulang
5. **`dostavka-api`** reponi tanlang
6. **"Deploy Now"** bosing

⏳ 2-3 daqiqa kuting...

---

## ✅ 6-QADAM: URL olish

Deploy bo'lgandan keyin Railway sizga URL beradi:

```
https://dostavka-api-production.up.railway.app
```

Shu URL ni browserda oching — API ishlayotganini ko'rasiz! ✅

---

## 🎉 Natija

Endi ilovangiz internetda! Istalgan joydan:

```
https://dostavka-api-production.up.railway.app/api/stores
https://dostavka-api-production.up.railway.app/api/orders
https://dostavka-api-production.up.railway.app/api/products
```

---

## ❓ Muammo bo'lsa

Railway dashboard da **"Logs"** bo'limini oching —
u yerda xatolar ko'rinadi.

Eng ko'p uchraydigan xato:
```
Error: Cannot find module 'express'
```
Yechim:
```bash
npm install express cors uuid
git add .
git commit -m "fix: paketlar qo'shildi"
git push
```

---

## 🔜 Keyingi qadam

Deploy bo'lgandan keyin:
- React Native panellaringizda `localhost:3000` ni
  Railway URL ga almashtiring
- Hamma qurilmalardan ishlaydi! 📱

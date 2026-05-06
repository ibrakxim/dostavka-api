import { useState } from "react";

const COLORS = {
  bg: "#F7F8FC",
  card: "#FFFFFF",
  accent: "#FF6B35",
  accentLight: "#FF8C5A",
  green: "#00C896",
  blue: "#3B82F6",
  red: "#E74C3C",
  text: "#1A1D27",
  muted: "#9CA3AF",
  border: "#EAECF4",
  dark: "#1A1D27",
};

const STORES = [
  { id: 1, name: "Baxt Oshxonasi", category: "O'zbek taomi", rating: 4.8, time: "25-35", delivery: 3000, emoji: "🍲", badge: "Tez yetkazish", products: [
    { id: 1, name: "Osh", price: 25000, emoji: "🍲", desc: "Klassik o'zbek oshi" },
    { id: 2, name: "Somsa", price: 8000, emoji: "🥟", desc: "Tandirda pishirilgan" },
    { id: 3, name: "Lag'mon", price: 22000, emoji: "🍜", desc: "Qo'lda tayyorlangan" },
    { id: 4, name: "Shurpa", price: 20000, emoji: "🍵", desc: "Issiq qo'y go'shti" },
  ]},
  { id: 2, name: "Toshkent Lazzat", category: "Milliy taomlar", rating: 4.5, time: "30-45", delivery: 2000, emoji: "🍢", badge: "Mashhur", products: [
    { id: 5, name: "Shashlik", price: 35000, emoji: "🍢", desc: "Ko'mirda pishirilgan" },
    { id: 6, name: "Manti", price: 18000, emoji: "🥟", desc: "Qo'lda yopilgan" },
    { id: 7, name: "Dimlama", price: 28000, emoji: "🥘", desc: "Sabzavotli go'sht" },
  ]},
  { id: 3, name: "Fast Burger", category: "Fastfood", rating: 4.2, time: "15-25", delivery: 4000, emoji: "🍔", badge: "Yangi", products: [
    { id: 8, name: "Burger", price: 30000, emoji: "🍔", desc: "Juicy beef burger" },
    { id: 9, name: "Kartoshka fri", price: 12000, emoji: "🍟", desc: "Crispy fries" },
    { id: 10, name: "Pepsi 0.5L", price: 7000, emoji: "🥤", desc: "Sovuq ichimlik" },
  ]},
  { id: 4, name: "Sushi House", category: "Yapon oshxonasi", rating: 4.7, time: "40-55", delivery: 5000, emoji: "🍣", badge: "Top rated", products: [
    { id: 11, name: "Sushi set", price: 55000, emoji: "🍣", desc: "12 dona aralash" },
    { id: 12, name: "Ramen", price: 32000, emoji: "🍜", desc: "Yapon usulida" },
    { id: 13, name: "Miso soup", price: 15000, emoji: "🍵", desc: "An'anaviy sho'rva" },
  ]},
];

const CATEGORIES = ["Barchasi", "O'zbek taomi", "Fastfood", "Yapon oshxonasi", "Milliy taomlar"];

const ORDER_HISTORY = [
  { id: "#4721", store: "Baxt Oshxonasi", emoji: "🍲", items: ["Osh x1", "Somsa x2"], total: 41000, date: "Bugun, 12:30", status: "yetkazildi" },
  { id: "#4698", store: "Fast Burger", emoji: "🍔", items: ["Burger x2", "Fri x1"], total: 72000, date: "Kecha, 19:15", status: "yetkazildi" },
  { id: "#4650", store: "Sushi House", emoji: "🍣", items: ["Sushi set x1"], total: 60000, date: "3 kun oldin", status: "yetkazildi" },
];

export default function CustomerPanel() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState(0);
  const [address, setAddress] = useState("");
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [notification, setNotification] = useState(null);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const addToCart = (product, store) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        ...product,
        storeName: store.name,
        storeId: store.id,
        qty: (prev[product.id]?.qty || 0) + 1
      }
    }));
    notify(`${product.emoji} Savatga qo'shildi!`);
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id].qty > 1) updated[id] = { ...updated[id], qty: updated[id].qty - 1 };
      else delete updated[id];
      return updated;
    });
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart({});
    setOrderStatus(0);
    setCheckoutStep("cart");
    setActiveTab("track");
    setTimeout(() => setOrderStatus(1), 3000);
    setTimeout(() => setOrderStatus(2), 8000);
    setTimeout(() => setOrderStatus(3), 15000);
  };

  const filteredStores = STORES.filter(s => {
    const matchCat = activeCategory === "Barchasi" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const trackSteps = [
    { label: "Buyurtma qabul qilindi", icon: "✅", desc: "Do'kon tayyorlayapti" },
    { label: "Tayyorlanmoqda", icon: "👨‍🍳", desc: "15-20 daqiqa" },
    { label: "Kuryer yo'lda", icon: "🚴", desc: "Ali sizga kelmoqda" },
    { label: "Yetkazildi!", icon: "🎉", desc: "Ishtaha ochiq!" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', sans-serif", color: COLORS.text, maxWidth: 430, margin: "0 auto", position: "relative" }}>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: COLORS.dark, color: "#fff",
          padding: "10px 20px", borderRadius: 30, fontWeight: 600, fontSize: 13,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", whiteSpace: "nowrap"
        }}>{notification}</div>
      )}

      {/* ===== HOME TAB ===== */}
      {activeTab === "home" && !selectedStore && (
        <div style={{ paddingBottom: 90 }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            padding: "48px 24px 28px", color: "#fff"
          }}>
            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>📍 Toshkent, Chilonzor</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Nima yemoqchisiz? 🍽️</div>
            <div style={{ position: "relative" }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Do'kon yoki taom qidiring..."
                style={{
                  width: "100%", borderRadius: 16, padding: "14px 16px 14px 44px",
                  border: "none", fontSize: 14, outline: "none",
                  boxSizing: "border-box", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
                }}
              />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
            </div>
          </div>

          {/* Categories */}
          <div style={{ padding: "16px 24px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? COLORS.accent : COLORS.card,
                color: activeCategory === cat ? "#fff" : COLORS.muted,
                border: `1px solid ${activeCategory === cat ? COLORS.accent : COLORS.border}`,
                borderRadius: 20, padding: "8px 16px", fontSize: 13,
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
              }}>{cat}</button>
            ))}
          </div>

          {/* Stores */}
          <div style={{ padding: "16px 24px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>🏪 Do'konlar</div>
            {filteredStores.map(store => (
              <div key={store.id} onClick={() => setSelectedStore(store)} style={{
                background: COLORS.card, borderRadius: 20, marginBottom: 14,
                border: `1px solid ${COLORS.border}`, cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden"
              }}>
                {/* Store Banner */}
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentLight}11)`,
                  padding: "20px", display: "flex", alignItems: "center", gap: 14,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: `${COLORS.accent}22`, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 30
                  }}>{store.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 17 }}>{store.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                        background: `${COLORS.accent}22`, color: COLORS.accent
                      }}>{store.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{store.category}</div>
                  </div>
                </div>
                {/* Store Info */}
                <div style={{ padding: "12px 20px", display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, color: "#FFD700", fontWeight: 600 }}>⭐ {store.rating}</span>
                  <span style={{ fontSize: 13, color: COLORS.muted }}>⏱️ {store.time} min</span>
                  <span style={{ fontSize: 13, color: COLORS.muted }}>🚴 {store.delivery.toLocaleString()} so'm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== STORE DETAIL ===== */}
      {activeTab === "home" && selectedStore && (
        <div style={{ paddingBottom: 90 }}>
          {/* Store Header */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            padding: "48px 24px 24px", color: "#fff"
          }}>
            <button onClick={() => setSelectedStore(null)} style={{
              background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12,
              color: "#fff", padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginBottom: 16
            }}>← Orqaga</button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 40 }}>{selectedStore.emoji}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedStore.name}</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>
                  ⭐ {selectedStore.rating} · ⏱️ {selectedStore.time} min · 🚴 {selectedStore.delivery.toLocaleString()} so'm
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>🍽️ Menyu</div>
            {selectedStore.products.map(product => {
              const qty = cart[product.id]?.qty || 0;
              return (
                <div key={product.id} style={{
                  background: COLORS.card, borderRadius: 18, padding: "16px",
                  marginBottom: 12, border: `1px solid ${COLORS.border}`,
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: `${COLORS.accent}15`, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0
                  }}>{product.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>{product.desc}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.accent }}>
                      {product.price.toLocaleString()} so'm
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {qty > 0 ? (
                      <>
                        <button onClick={() => removeFromCart(product.id)} style={{
                          width: 32, height: 32, borderRadius: 10, border: "none",
                          background: `${COLORS.accent}22`, color: COLORS.accent,
                          fontSize: 18, fontWeight: 700, cursor: "pointer"
                        }}>−</button>
                        <span style={{ fontWeight: 700, fontSize: 15, minWidth: 16, textAlign: "center" }}>{qty}</span>
                      </>
                    ) : null}
                    <button onClick={() => addToCart(product, selectedStore)} style={{
                      width: 32, height: 32, borderRadius: 10, border: "none",
                      background: COLORS.accent, color: "#fff",
                      fontSize: 18, fontWeight: 700, cursor: "pointer",
                      boxShadow: `0 4px 12px ${COLORS.accent}44`
                    }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Go to cart button */}
          {cartCount > 0 && (
            <div style={{ padding: "20px 24px" }}>
              <button onClick={() => setActiveTab("cart")} style={{
                width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                color: "#fff", border: "none", borderRadius: 18,
                padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: `0 6px 24px ${COLORS.accent}44`
              }}>
                <span>🛒 Savat ({cartCount})</span>
                <span>{cartTotal.toLocaleString()} so'm →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== CART TAB ===== */}
      {activeTab === "cart" && (
        <div style={{ paddingBottom: 90 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            padding: "48px 24px 24px", color: "#fff"
          }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>🛒 Savatcha</div>
          </div>

          {cartItems.length === 0 && checkoutStep === "cart" ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: COLORS.muted }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Savatcha bo'sh</div>
              <div style={{ fontSize: 13 }}>Do'kondan mahsulot qo'shing</div>
              <button onClick={() => setActiveTab("home")} style={{
                marginTop: 20, background: COLORS.accent, color: "#fff",
                border: "none", borderRadius: 14, padding: "12px 28px",
                fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>Do'konlarga o'tish</button>
            </div>
          ) : checkoutStep === "cart" ? (
            <div style={{ padding: "20px 24px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  background: COLORS.card, borderRadius: 18, padding: "14px 16px",
                  marginBottom: 10, border: `1px solid ${COLORS.border}`,
                  display: "flex", alignItems: "center", gap: 12
                }}>
                  <div style={{ fontSize: 28, width: 44, textAlign: "center" }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 700 }}>
                      {(item.price * item.qty).toLocaleString()} so'm
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: `${COLORS.accent}22`, color: COLORS.accent,
                      fontSize: 16, fontWeight: 700, cursor: "pointer"
                    }}>−</button>
                    <span style={{ fontWeight: 700, fontSize: 14, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => addToCart(item, { id: item.storeId, name: item.storeName })} style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: COLORS.accent, color: "#fff",
                      fontSize: 16, fontWeight: 700, cursor: "pointer"
                    }}>+</button>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div style={{ background: COLORS.card, borderRadius: 18, padding: "16px", border: `1px solid ${COLORS.border}`, marginTop: 8 }}>
                {[
                  { label: "Mahsulotlar", value: `${cartTotal.toLocaleString()} so'm` },
                  { label: "Yetkazib berish", value: "3 000 so'm" },
                  { label: "Jami", value: `${(cartTotal + 3000).toLocaleString()} so'm`, bold: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 10 : 0, paddingTop: i === 2 ? 10 : 0, borderTop: i === 2 ? `1px solid ${COLORS.border}` : "none" }}>
                    <span style={{ fontSize: 14, color: row.bold ? COLORS.text : COLORS.muted, fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: row.bold ? 800 : 600, color: row.bold ? COLORS.accent : COLORS.text }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setCheckoutStep("address")} style={{
                width: "100%", marginTop: 16,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                color: "#fff", border: "none", borderRadius: 18,
                padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 6px 24px ${COLORS.accent}44`
              }}>Buyurtma berish →</button>
            </div>
          ) : (
            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>📍 Yetkazib berish manzili</div>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ko'cha, uy raqami, xonadon..."
                rows={3}
                style={{
                  width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  borderRadius: 14, padding: "14px", fontSize: 14, color: COLORS.text,
                  outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 14
                }}
              />
              {[
                { icon: "🏠", label: "Uyim", address: "Chilonzor, 12-kvartal, 45-uy" },
                { icon: "💼", label: "Ish", address: "Amir Temur ko'chasi, 108" },
              ].map((saved, i) => (
                <div key={i} onClick={() => setAddress(saved.address)} style={{
                  background: COLORS.card, borderRadius: 14, padding: "12px 16px",
                  marginBottom: 10, border: `1px solid ${COLORS.border}`,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12
                }}>
                  <span style={{ fontSize: 20 }}>{saved.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{saved.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{saved.address}</div>
                  </div>
                </div>
              ))}

              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 20, marginBottom: 14 }}>💳 To'lov usuli</div>
              {[
                { icon: "💵", label: "Naqd pul" },
                { icon: "💳", label: "Karta" },
              ].map((method, i) => (
                <div key={i} style={{
                  background: i === 0 ? `${COLORS.accent}15` : COLORS.card,
                  border: `1px solid ${i === 0 ? COLORS.accent : COLORS.border}`,
                  borderRadius: 14, padding: "12px 16px", marginBottom: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12
                }}>
                  <span style={{ fontSize: 20 }}>{method.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: i === 0 ? COLORS.accent : COLORS.text }}>{method.label}</span>
                  {i === 0 && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
                </div>
              ))}

              <button onClick={placeOrder} disabled={!address} style={{
                width: "100%", marginTop: 20,
                background: address ? `linear-gradient(135deg, ${COLORS.green}, #00E5A8)` : COLORS.border,
                color: address ? "#fff" : COLORS.muted,
                border: "none", borderRadius: 18,
                padding: "16px", fontSize: 16, fontWeight: 700,
                cursor: address ? "pointer" : "not-allowed",
                boxShadow: address ? `0 6px 24px ${COLORS.green}44` : "none"
              }}>
                ✅ Buyurtmani tasdiqlash
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== TRACK TAB ===== */}
      {activeTab === "track" && (
        <div style={{ paddingBottom: 90 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.green}, #00E5A8)`,
            padding: "48px 24px 24px", color: "#fff"
          }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>📍 Kuzatish</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>Buyurtma #4822</div>
          </div>

          {!orderPlaced ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: COLORS.muted }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Faol buyurtma yo'q</div>
              <div style={{ fontSize: 13 }}>Buyurtma bergandan so'ng bu yerda ko'rinadi</div>
            </div>
          ) : (
            <div style={{ padding: "24px" }}>
              {/* Map placeholder */}
              <div style={{
                background: `linear-gradient(135deg, #e8f5e9, #f1f8e9)`,
                borderRadius: 20, height: 160, marginBottom: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden"
              }}>
                <div style={{ fontSize: 13, color: COLORS.muted, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
                  Kuryer haritasi
                </div>
                {orderStatus >= 2 && (
                  <div style={{
                    position: "absolute", top: "50%", left: "40%",
                    transform: "translate(-50%, -50%)", fontSize: 28,
                    animation: "bounce 1s infinite"
                  }}>🚴</div>
                )}
              </div>

              {/* Steps */}
              <div style={{ background: COLORS.card, borderRadius: 20, padding: "20px", border: `1px solid ${COLORS.border}` }}>
                {trackSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 20 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: i <= orderStatus ? `${COLORS.green}22` : COLORS.bg,
                        border: `2px solid ${i <= orderStatus ? COLORS.green : COLORS.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                        transition: "all 0.5s"
                      }}>
                        {i <= orderStatus ? step.icon : "○"}
                      </div>
                      {i < 3 && <div style={{ width: 2, height: 20, background: i < orderStatus ? COLORS.green : COLORS.border, marginTop: 4, transition: "all 0.5s" }} />}
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: i <= orderStatus ? COLORS.text : COLORS.muted }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {orderStatus >= 2 && orderStatus < 3 && (
                <div style={{ background: `${COLORS.blue}15`, borderRadius: 16, padding: "14px 16px", marginTop: 16, border: `1px solid ${COLORS.blue}33` }}>
                  <div style={{ fontWeight: 700, color: COLORS.blue, marginBottom: 4 }}>🚴 Kuryer: Ali Karimov</div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>+998 90 123 45 67</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== PROFILE TAB ===== */}
      {activeTab === "profile" && (
        <div style={{ paddingBottom: 90 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.blue}, #60A5FA)`,
            padding: "48px 24px 32px", color: "#fff", textAlign: "center"
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 36,
              margin: "0 auto 12px"
            }}>👤</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Jasur Toshmatov</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>+998 90 123 45 67</div>
          </div>

          <div style={{ padding: "20px 24px" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Buyurtmalar", value: "24", icon: "📦" },
                { label: "Sarflangan", value: "1.2M", icon: "💰" },
                { label: "Bonus", value: "2 400", icon: "⭐" },
              ].map((s, i) => (
                <div key={i} style={{ background: COLORS.card, borderRadius: 16, padding: "14px 10px", textAlign: "center", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>📋 Buyurtmalar tarixi</div>
            {ORDER_HISTORY.map(order => (
              <div key={order.id} style={{
                background: COLORS.card, borderRadius: 18, padding: "14px 16px",
                marginBottom: 10, border: `1px solid ${COLORS.border}`,
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: `${COLORS.accent}15`, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
                }}>{order.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{order.store}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent }}>{order.total.toLocaleString()} so'm</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>{order.items.join(", ")}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{order.date}</div>
                </div>
              </div>
            ))}

            {/* Settings */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, marginTop: 20 }}>⚙️ Sozlamalar</div>
            {[
              { icon: "📍", label: "Manzillarim" },
              { icon: "💳", label: "To'lov usullari" },
              { icon: "🔔", label: "Bildirishnomalar" },
              { icon: "❓", label: "Yordam" },
            ].map((item, i) => (
              <div key={i} style={{
                background: COLORS.card, borderRadius: 14, padding: "14px 16px",
                marginBottom: 8, border: `1px solid ${COLORS.border}`,
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer"
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{item.label}</span>
                <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: COLORS.card, borderTop: `1px solid ${COLORS.border}`,
        display: "flex", padding: "10px 0 20px", justifyContent: "space-around",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)"
      }}>
        {[
          { key: "home", icon: "🏠", label: "Asosiy" },
          { key: "cart", icon: "🛒", label: "Savat", badge: cartCount },
          { key: "track", icon: "📍", label: "Kuzatish" },
          { key: "profile", icon: "👤", label: "Profil" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: activeTab === tab.key ? COLORS.accent : COLORS.muted,
            position: "relative", padding: "4px 12px"
          }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 6,
                background: COLORS.accent, color: "#fff",
                fontSize: 9, fontWeight: 800, borderRadius: "50%",
                width: 16, height: 16, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-8px)} }
        button:active { opacity: 0.8; }
        input::placeholder, textarea::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  );
}

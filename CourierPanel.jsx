import { useState } from "react";

const COLORS = {
  bg: "#0A0E1A",
  card: "#131829",
  accent: "#00C896",
  accentLight: "#00E5A8",
  orange: "#FF6B35",
  red: "#E74C3C",
  blue: "#3B82F6",
  text: "#F0F0F0",
  muted: "#6B7280",
  border: "#1E2438",
};

const STORES = [
  {
    id: 1,
    name: "Baxt Oshxonasi",
    address: "Chilonzor, 12-kvartal",
    rating: 4.8,
    emoji: "🍲",
    distance: "1.2 km",
    products: [
      { id: 1, name: "Osh", stock: 12, price: 25000, emoji: "🍲" },
      { id: 2, name: "Somsa", stock: 30, price: 8000, emoji: "🥟" },
      { id: 3, name: "Lag'mon", stock: 8, price: 22000, emoji: "🍜" },
      { id: 4, name: "Non", stock: 25, price: 3000, emoji: "🍞" },
    ],
  },
  {
    id: 2,
    name: "Toshkent Lazzat",
    address: "Yunusobod, 19-mavze",
    rating: 4.5,
    emoji: "🍢",
    distance: "2.7 km",
    products: [
      { id: 5, name: "Shashlik", stock: 15, price: 35000, emoji: "🍢" },
      { id: 6, name: "Coca-Cola", stock: 50, price: 7000, emoji: "🥤" },
      { id: 7, name: "Manti", stock: 3, price: 18000, emoji: "🥟" },
    ],
  },
  {
    id: 3,
    name: "Fast Burger",
    address: "Mirzo Ulug'bek, 5-uy",
    rating: 4.2,
    emoji: "🍔",
    distance: "3.5 km",
    products: [
      { id: 8, name: "Burger", stock: 20, price: 30000, emoji: "🍔" },
      { id: 9, name: "Kartoshka fri", stock: 40, price: 12000, emoji: "🍟" },
      { id: 10, name: "Pepsi", stock: 0, price: 7000, emoji: "🥤" },
    ],
  },
];

const ORDERS = [
  { id: "#4821", store: "Baxt Oshxonasi", customer: "Jasur T.", address: "Amir Temur ko'chasi, 45", items: ["Osh x1", "Somsa x2"], total: 41000, status: "yangi", time: "2 daq oldin" },
  { id: "#4820", store: "Toshkent Lazzat", customer: "Malika R.", address: "Navoiy ko'chasi, 12", items: ["Shashlik x2", "Coca-Cola x1"], total: 77000, status: "yolda", time: "12 daq oldin" },
  { id: "#4819", store: "Fast Burger", customer: "Bobur S.", address: "Mustaqillik maydoni, 3", items: ["Burger x1", "Kartoshka x1"], total: 42000, status: "yetkazildi", time: "35 daq oldin" },
];

const STATUS_CONFIG = {
  yangi: { color: COLORS.orange, bg: `${COLORS.orange}22`, label: "🔔 Yangi", icon: "🔔" },
  yolda: { color: COLORS.blue, bg: `${COLORS.blue}22`, label: "🚴 Yo'lda", icon: "🚴" },
  yetkazildi: { color: COLORS.accent, bg: `${COLORS.accent}22`, label: "✅ Yetkazildi", icon: "✅" },
};

export default function CourierPanel() {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedStore, setSelectedStore] = useState(null);
  const [orders, setOrders] = useState(ORDERS);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const acceptOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "yolda" } : o));
    notify("Buyurtma qabul qilindi! 🚴");
  };

  const deliverOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "yetkazildi" } : o));
    notify("Yetkazildi! ✅");
  };

  const activeOrders = orders.filter(o => o.status !== "yetkazildi").length;
  const deliveredToday = orders.filter(o => o.status === "yetkazildi").length;
  const earned = orders.filter(o => o.status === "yetkazildi").reduce((s, o) => s + Math.round(o.total * 0.1), 0);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', sans-serif", color: COLORS.text }}>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: notification.type === "error" ? COLORS.red : COLORS.accent,
          color: "#fff", padding: "12px 24px", borderRadius: 12,
          fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0D1B2A, #1A2744)`,
        padding: "24px 24px 20px",
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              🚴 Kuryer Paneli
            </div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Salom, Ali! 👋</div>
          </div>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
          }}>🧑</div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Faol", value: activeOrders, color: COLORS.orange, icon: "🔥" },
            { label: "Yetkazildi", value: deliveredToday, color: COLORS.accent, icon: "✅" },
            { label: "Daromad", value: `${earned.toLocaleString()}`, color: COLORS.blue, icon: "💰" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 14,
              padding: "12px 10px", textAlign: "center",
              border: `1px solid rgba(255,255,255,0.08)`
            }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: COLORS.card, borderBottom: `1px solid ${COLORS.border}` }}>
        {[
          { key: "orders", label: "📦 Buyurtmalar" },
          { key: "stores", label: "🏪 Do'konlar" },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedStore(null); }} style={{
            flex: 1, padding: "14px", border: "none",
            background: "transparent", color: activeTab === tab.key ? COLORS.accent : COLORS.muted,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            borderBottom: `2px solid ${activeTab === tab.key ? COLORS.accent : "transparent"}`,
            transition: "all 0.2s"
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div style={{ padding: "16px 24px 100px" }}>
          {orders.map(order => {
            const sc = STATUS_CONFIG[order.status];
            return (
              <div key={order.id} style={{
                background: COLORS.card, borderRadius: 20, padding: "18px",
                marginBottom: 14, border: `1px solid ${COLORS.border}`,
              }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{order.id}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: sc.bg, color: sc.color
                      }}>{sc.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{order.time}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.accent }}>
                    {order.total.toLocaleString()} so'm
                  </div>
                </div>

                {/* Store & Customer */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div style={{ background: COLORS.bg, borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3, fontWeight: 600 }}>DO'KON</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>🏪 {order.store}</div>
                  </div>
                  <div style={{ background: COLORS.bg, borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3, fontWeight: 600 }}>MIJOZ</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>👤 {order.customer}</div>
                  </div>
                </div>

                {/* Address */}
                <div style={{ background: COLORS.bg, borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3, fontWeight: 600 }}>MANZIL</div>
                  <div style={{ fontSize: 13 }}>📍 {order.address}</div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6, fontWeight: 600 }}>MAHSULOTLAR</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {order.items.map((item, i) => (
                      <span key={i} style={{
                        background: `${COLORS.accent}15`, color: COLORS.accent,
                        fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 600
                      }}>{item}</span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {order.status === "yangi" && (
                  <button onClick={() => acceptOrder(order.id)} style={{
                    width: "100%", background: `linear-gradient(135deg, ${COLORS.orange}, #FF8C5A)`,
                    color: "#fff", border: "none", borderRadius: 14,
                    padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                    boxShadow: `0 4px 20px ${COLORS.orange}44`
                  }}>
                    🚴 Qabul qilish
                  </button>
                )}
                {order.status === "yolda" && (
                  <button onClick={() => deliverOrder(order.id)} style={{
                    width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                    color: "#fff", border: "none", borderRadius: 14,
                    padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                    boxShadow: `0 4px 20px ${COLORS.accent}44`
                  }}>
                    ✅ Yetkazildi
                  </button>
                )}
                {order.status === "yetkazildi" && (
                  <div style={{
                    textAlign: "center", color: COLORS.accent,
                    fontSize: 14, fontWeight: 600, padding: "6px 0"
                  }}>
                    ✅ Muvaffaqiyatli yetkazildi
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* STORES TAB */}
      {activeTab === "stores" && !selectedStore && (
        <div style={{ padding: "16px 24px 100px" }}>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>
            Do'konni tanlang — mahsulot zaxirasini ko'ring
          </div>
          {STORES.map(store => (
            <div key={store.id} onClick={() => setSelectedStore(store)} style={{
              background: COLORS.card, borderRadius: 20, padding: "18px",
              marginBottom: 12, border: `1px solid ${COLORS.border}`,
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: `${COLORS.accent}22`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0
              }}>
                {store.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{store.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>📍 {store.address}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#FFD700", fontWeight: 600 }}>⭐ {store.rating}</span>
                  <span style={{ fontSize: 12, color: COLORS.muted }}>🚴 {store.distance}</span>
                  <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>
                    {store.products.length} mahsulot
                  </span>
                </div>
              </div>
              <div style={{ color: COLORS.muted, fontSize: 20 }}>›</div>
            </div>
          ))}
        </div>
      )}

      {/* STORE DETAIL — Products */}
      {activeTab === "stores" && selectedStore && (
        <div style={{ padding: "16px 24px 100px" }}>
          <button onClick={() => setSelectedStore(null)} style={{
            background: "none", border: "none", color: COLORS.accent,
            fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 6, padding: 0
          }}>
            ← Orqaga
          </button>

          <div style={{
            background: COLORS.card, borderRadius: 20, padding: "18px",
            border: `1px solid ${COLORS.border}`, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 14
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16,
              background: `${COLORS.accent}22`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 28
            }}>
              {selectedStore.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{selectedStore.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>📍 {selectedStore.address}</div>
              <div style={{ fontSize: 12, color: "#FFD700", marginTop: 4 }}>⭐ {selectedStore.rating} · 🚴 {selectedStore.distance}</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Mahsulotlar zaxirasi
          </div>

          {selectedStore.products.map(product => (
            <div key={product.id} style={{
              background: COLORS.card, borderRadius: 16, padding: "14px 16px",
              marginBottom: 10, border: `1px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${COLORS.accent}22`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
              }}>
                {product.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{product.name}</div>
                <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 700 }}>
                  {product.price.toLocaleString()} so'm
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: 20, fontWeight: 800,
                  color: product.stock === 0 ? COLORS.red : product.stock < 5 ? COLORS.orange : COLORS.accent
                }}>
                  {product.stock}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: product.stock === 0 ? COLORS.red : product.stock < 5 ? COLORS.orange : COLORS.muted
                }}>
                  {product.stock === 0 ? "🔴 Tugagan" : product.stock < 5 ? "⚠️ Kam" : "dona"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: COLORS.card, borderTop: `1px solid ${COLORS.border}`,
        display: "flex", padding: "12px 24px 20px", justifyContent: "space-around"
      }}>
        {[
          { key: "orders", icon: "📦", label: "Buyurtmalar" },
          { key: "stores", icon: "🏪", label: "Do'konlar" },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedStore(null); }} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: activeTab === tab.key ? COLORS.accent : COLORS.muted,
            transition: "all 0.2s"
          }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <style>{`button:active { opacity: 0.75; }`}</style>
    </div>
  );
}

import { useState } from "react";

const COLORS = {
  bg: "#0F1117",
  card: "#1A1D27",
  accent: "#FF6B35",
  accentLight: "#FF8C5A",
  green: "#2ECC71",
  red: "#E74C3C",
  text: "#F0F0F0",
  muted: "#8A8FA8",
  border: "#2A2D3E",
};

const initialProducts = [
  { id: 1, name: "Osh", price: 25000, stock: 12, category: "Asosiy taom", emoji: "🍲" },
  { id: 2, name: "Somsa", price: 8000, stock: 30, category: "Non mahsuloti", emoji: "🥟" },
  { id: 3, name: "Lag'mon", price: 22000, stock: 8, category: "Asosiy taom", emoji: "🍜" },
  { id: 4, name: "Coca-Cola", price: 7000, stock: 50, category: "Ichimlik", emoji: "🥤" },
  { id: 5, name: "Shashlik", price: 35000, stock: 15, category: "Go'sht", emoji: "🍢" },
];

const categories = ["Barchasi", "Asosiy taom", "Non mahsuloti", "Ichimlik", "Go'sht"];

export default function ShopPanel() {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "Asosiy taom", emoji: "🍽️" });
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "Barchasi" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter(p => p.stock < 10).length;

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", stock: "", category: "Asosiy taom", emoji: "🍽️" });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({ name: product.name, price: String(product.price), stock: String(product.stock), category: product.category, emoji: product.emoji });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id
        ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) }
        : p));
      notify("Mahsulot yangilandi ✓");
    } else {
      setProducts([...products, { id: Date.now(), ...form, price: Number(form.price), stock: Number(form.stock) }]);
      notify("Mahsulot qo'shildi ✓");
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    notify("Mahsulot o'chirildi", "error");
  };

  const updateStock = (id, delta) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', sans-serif", color: COLORS.text }}>
      
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: notification.type === "error" ? COLORS.red : COLORS.green,
          color: "#fff", padding: "12px 24px", borderRadius: 12,
          fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease"
        }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            🏪 Do'kon Paneli
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Mahsulotlar</div>
        </div>
        <button onClick={openAdd} style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          color: "#fff", border: "none", borderRadius: 12,
          padding: "10px 20px", fontWeight: 700, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          boxShadow: `0 4px 20px ${COLORS.accent}44`
        }}>
          + Qo'shish
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "20px 24px 0" }}>
        {[
          { label: "Jami mahsulot", value: totalProducts, color: COLORS.accent, icon: "📦" },
          { label: "Jami zaxira", value: totalStock, color: COLORS.green, icon: "✅" },
          { label: "Kam zaxira", value: lowStock, color: COLORS.red, icon: "⚠️" },
        ].map((s, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 16, padding: "16px 14px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: "16px 24px 0" }}>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍  Mahsulot qidirish..."
          style={{
            width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "12px 16px", color: COLORS.text,
            fontSize: 14, outline: "none", boxSizing: "border-box"
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ padding: "14px 24px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? COLORS.accent : COLORS.card,
            color: activeCategory === cat ? "#fff" : COLORS.muted,
            border: `1px solid ${activeCategory === cat ? COLORS.accent : COLORS.border}`,
            borderRadius: 20, padding: "7px 16px", fontSize: 13,
            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            transition: "all 0.2s"
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div style={{ padding: "16px 24px 100px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: COLORS.muted, padding: "60px 0", fontSize: 15 }}>
            😕 Mahsulot topilmadi
          </div>
        )}
        {filtered.map(product => (
          <div key={product.id} style={{
            background: COLORS.card, borderRadius: 18, padding: "16px",
            marginBottom: 12, border: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", gap: 14,
            transition: "transform 0.15s"
          }}>
            {/* Emoji */}
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${COLORS.accent}22`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0
            }}>
              {product.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>{product.category}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.accent }}>
                  {product.price.toLocaleString()} so'm
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                  background: product.stock < 10 ? `${COLORS.red}33` : `${COLORS.green}33`,
                  color: product.stock < 10 ? COLORS.red : COLORS.green
                }}>
                  {product.stock < 10 ? "⚠️ " : ""}Zaxira: {product.stock}
                </span>
              </div>
            </div>

            {/* Stock Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <button onClick={() => updateStock(product.id, 1)} style={{
                background: `${COLORS.green}22`, color: COLORS.green, border: "none",
                borderRadius: 8, width: 30, height: 30, fontSize: 18,
                cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
              }}>+</button>
              <button onClick={() => updateStock(product.id, -1)} style={{
                background: `${COLORS.red}22`, color: COLORS.red, border: "none",
                borderRadius: 8, width: 30, height: 30, fontSize: 18,
                cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
              }}>−</button>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={() => openEdit(product)} style={{
                background: `${COLORS.accent}22`, color: COLORS.accent,
                border: "none", borderRadius: 8, padding: "6px 12px",
                fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}>✏️ Tahrir</button>
              <button onClick={() => handleDelete(product.id)} style={{
                background: `${COLORS.red}22`, color: COLORS.red,
                border: "none", borderRadius: 8, padding: "6px 12px",
                fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}>🗑️ O'chir</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000
        }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{
            background: COLORS.card, borderRadius: "24px 24px 0 0",
            padding: "28px 24px 40px", width: "100%", maxWidth: 500,
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
              {editingProduct ? "✏️ Mahsulotni tahrirlash" : "➕ Yangi mahsulot"}
            </div>

            {[
              { label: "Mahsulot nomi", key: "name", placeholder: "Masalan: Osh", type: "text" },
              { label: "Narxi (so'm)", key: "price", placeholder: "Masalan: 25000", type: "number" },
              { label: "Zaxira miqdori", key: "stock", placeholder: "Masalan: 20", type: "number" },
              { label: "Emoji", key: "emoji", placeholder: "🍽️", type: "text" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600 }}>{field.label}</div>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                    borderRadius: 12, padding: "12px 14px", color: COLORS.text,
                    fontSize: 15, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600 }}>Kategoriya</div>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{
                  width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 12, padding: "12px 14px", color: COLORS.text,
                  fontSize: 15, outline: "none", boxSizing: "border-box"
                }}
              >
                {categories.filter(c => c !== "Barchasi").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, background: COLORS.bg, color: COLORS.muted,
                border: `1px solid ${COLORS.border}`, borderRadius: 14,
                padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer"
              }}>Bekor</button>
              <button onClick={handleSave} style={{
                flex: 2, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                color: "#fff", border: "none", borderRadius: 14,
                padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 4px 20px ${COLORS.accent}44`
              }}>
                {editingProduct ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        button:hover { opacity: 0.85; }
        input::placeholder { color: #555; }
      `}</style>
    </div>
  );
}

// pages/tenants.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  apiMe,
  apiGetTenants,
  apiAddTenant,
  apiGetProperties,
} from "../lib/api";

export default function TenantsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const u = await apiMe();
        setUser(u);

        const p = await apiGetProperties();
        setProperties(p);

        const t = await apiGetTenants();
        setTenants(t);
      } catch {
        router.push("/login");
      }
    }

    load();
  }, []);

  async function handleAddTenant(e) {
    e.preventDefault();
    try {
      const payload = { name, email, phone, property_id: Number(propertyId) };
      const newTenant = await apiAddTenant(payload);

      setTenants([newTenant, ...tenants]); // ✅ Live refresh
      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setPropertyId("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (!user) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tenants</h1>

      <button style={styles.addButton} onClick={() => setShowForm(true)}>
        + Add Tenant
      </button>

      {/* Modal Form */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Tenant</h2>
            <form onSubmit={handleAddTenant}>
              <input
                style={styles.input}
                placeholder="Tenant Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                style={styles.input}
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <select
                style={styles.input}
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
              >
                <option value="">Select Property...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveButton}>
                  Save
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant List */}
      <div style={styles.list}>
        {tenants.length === 0 ? (
          <p>No tenants yet.</p>
        ) : (
          tenants.map((t) => (
            <div key={t.id} style={styles.item}>
              <strong>{t.name}</strong>
              {t.email && <div>{t.email}</div>}
              {t.phone && <div>{t.phone}</div>}
              <small style={{ opacity: 0.6 }}>Property #{t.property_id}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px" },
  title: { marginBottom: "20px", color: "#D4A018" },
  addButton: {
    padding: "10px 15px",
    background: "#D4A018",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  },
  list: { marginTop: "20px" },
  item: {
    padding: "15px",
    border: "1px solid #eee",
    borderRadius: "8px",
    marginBottom: "10px",
    background: "#fff",
  },
  loading: { padding: "50px", textAlign: "center" },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "350px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalActions: { display: "flex", justifyContent: "space-between" },
  saveButton: {
    background: "#2c7",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
  },
  cancelButton: {
    background: "#999",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
  },
};

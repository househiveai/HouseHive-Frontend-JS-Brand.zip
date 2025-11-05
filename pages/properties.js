// pages/properties.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiMe, apiGetProperties, apiAddProperty } from "../lib/api";
import RequireAuth from "../components/RequireAuth";

export default function PropertiesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  

    load();
  }, []);

  async function handleAddProperty(e) {
    e.preventDefault();
    try {
      const newProp = await apiAddProperty({ name, address });
      setProperties([newProp, ...properties]); // ✅ instantly update UI
      setShowForm(false);
      setName("");
      setAddress("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (!user) return <div style={styles.loading}>Loading...</div>;

  return (
    RequireAuth>
    <div style={styles.page}>
      <h1 style={styles.title}>Your Properties</h1>

      <button style={styles.addButton} onClick={() => setShowForm(true)}>
        + Add Property
      </button>

      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Property</h2>
            <form onSubmit={handleAddProperty}>
              <input
                style={styles.input}
                placeholder="Property Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                style={styles.input}
                placeholder="Address (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button type="button" style={styles.cancelButton} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.list}>
        {properties.length === 0 ? (
          <p>No properties yet.</p>
        ) : (
          properties.map((p) => (
            <div key={p.id} style={styles.item}>
              <strong>{p.name}</strong>
              <div>{p.address}</div>
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

  // modal
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: { background: "#fff", padding: "25px", borderRadius: "10px", width: "350px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  modalActions: { display: "flex", justifyContent: "space-between" },
  saveButton: { background: "#2c7", padding: "10px 15px", border: "none", borderRadius: "6px", cursor: "pointer", color: "#fff" },
  cancelButton: { background: "#999", padding: "10px 15px", border: "none", borderRadius: "6px", cursor: "pointer", color: "#fff" },
};

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import {
  apiAddTenant,
  apiGetProperties,
  apiGetTenants,
  apiMe,
} from "../lib/api";

export default function TenantsPage() {
  return (
    <RequireAuth>
      <TenantsContent />
    </RequireAuth>
  );
}

function TenantsContent() {
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [me, propertyList, tenantList] = await Promise.all([
          apiMe(),
          apiGetProperties(),
          apiGetTenants(),
        ]);

        if (!isMounted) return;

        setUser(me);
        setProperties(propertyList);
        setTenants(tenantList);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load tenants.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const propertyLookup = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property.id] = property.name;
      return acc;
    }, {});
  }, [properties]);

  async function handleAddTenant(event) {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        property_id: Number(propertyId),
      };

      const newTenant = await apiAddTenant(payload);
      setTenants((prev) => [newTenant, ...prev]);

      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setPropertyId("");
    } catch (err) {
      setError(err?.message || "Unable to add tenant. Please try again.");
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading tenants...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tenants</h1>
      {user && (
        <p style={styles.subtitle}>
          Managing tenants for <strong>{user.name || user.email}</strong>
        </p>
      )}

      {error && (
        <div style={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <button style={styles.addButton} onClick={() => setShowForm(true)}>
        + Add Tenant
      </button>

      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Tenant</h2>
            <form onSubmit={handleAddTenant}>
              <input
                style={styles.input}
                placeholder="Tenant Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <input
                style={styles.input}
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Phone (optional)"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />

              <select
                style={styles.input}
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                required
              >
                <option value="">Select Property...</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
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

      <div style={styles.list}>
        {tenants.length === 0 ? (
          <p>No tenants yet.</p>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant.id} style={styles.item}>
              <strong>{tenant.name}</strong>
              {tenant.email && <div>{tenant.email}</div>}
              {tenant.phone && <div>{tenant.phone}</div>}
              <small style={{ opacity: 0.6 }}>
                {propertyLookup[tenant.property_id]
                  ? `Property: ${propertyLookup[tenant.property_id]}`
                  : `Property #${tenant.property_id}`}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px" },
  title: { marginBottom: "8px", color: "#D4A018", fontSize: "28px" },
  subtitle: { marginBottom: "20px", color: "#555" },
  addButton: {
    padding: "10px 15px",
    background: "#D4A018",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  },
  errorBanner: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    padding: "12px 16px",
    marginBottom: "16px",
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
    maxWidth: "90vw",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalActions: { display: "flex", justifyContent: "space-between", gap: "8px" },
  saveButton: {
    background: "#22c55e",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
  },
  cancelButton: {
    background: "#9ca3af",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
  },
};

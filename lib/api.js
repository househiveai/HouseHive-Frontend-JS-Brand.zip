// ================================
// 👥 TENANTS
// ================================
export async function apiAddTenant(payload) {
  try {
    const { data } = await api.post("/api/tenants", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetTenants() {
  try {
    const { data } = await api.get("/api/tenants");
    return data;
  } catch (err) {
    handleError(err);
  }
}

// ================================
// 🧹 TASKS
// ================================
export async function apiAddTask(payload) {
  try {
    const { data } = await api.post("/api/tasks", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetTasks() {
  try {
    const { data } = await api.get("/api/tasks");
    return data;
  } catch (err) {
    handleError(err);
  }
}

// ================================
// ⏰ REMINDERS
// ================================
export async function apiAddReminder(payload) {
  try {
    const { data } = await api.post("/api/reminders", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetReminders() {
  try {
    const { data } = await api.get("/api/reminders");
    return data;
  } catch (err) {
    handleError(err);
  }
}

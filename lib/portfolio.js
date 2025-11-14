import { useMemo } from "react";
import { apiGetProperties, apiGetReminders, apiGetTasks, apiGetTenants } from "./api.js";

const EMPTY_FINANCIALS = Object.freeze({ revenue: 0, expenses: 0, net: 0, estimated: false });
const EMPTY_OCCUPANCY = Object.freeze({
  rented: 0,
  vacant: 0,
  total: 0,
  rate: 0,
  vacancyRate: 0,
  estimated: false,
});
const EMPTY_METRICS_BLUEPRINT = Object.freeze({
  propertyCount: 0,
  tenantCount: 0,
  taskCount: 0,
  reminderCount: 0,
  financials: EMPTY_FINANCIALS,
  occupancy: EMPTY_OCCUPANCY,
});

export function createEmptyMetrics() {
  return {
    propertyCount: EMPTY_METRICS_BLUEPRINT.propertyCount,
    tenantCount: EMPTY_METRICS_BLUEPRINT.tenantCount,
    taskCount: EMPTY_METRICS_BLUEPRINT.taskCount,
    reminderCount: EMPTY_METRICS_BLUEPRINT.reminderCount,
    financials: { ...EMPTY_FINANCIALS },
    occupancy: { ...EMPTY_OCCUPANCY },
  };
}

function normalizeCollection(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection?.results)) return collection.results;
  if (typeof collection === "object" && collection !== null) {
    if (typeof collection.count === "number" && Array.isArray(collection.items)) {
      return collection.items;
    }
  }
  return [];
}

function coerceNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    const parsed = Number.parseFloat(normalized);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function getFirstNumericValue(source, keys) {
  if (!source || !keys?.length) return 0;
  for (const key of keys) {
    if (key in source) {
      const val = coerceNumber(source[key]);
      if (val) return val;
    }
  }
  return 0;
}

function deriveFinancials(properties = [], tenants = []) {
  const rentFields = ["monthly_rent", "rent", "expected_rent", "monthlyRevenue", "revenue"];
  const expenseFields = ["monthly_expenses", "expenses", "expense", "operating_cost", "maintenance_cost"];
  let revenue = 0;
  let expenses = 0;

  properties.forEach((property) => {
    revenue += getFirstNumericValue(property, rentFields);
    expenses += getFirstNumericValue(property, expenseFields);
  });

  tenants.forEach((tenant) => {
    revenue += getFirstNumericValue(tenant, ["monthly_rent", "rent", "payment_amount"]);
  });

  let estimated = false;

  if (revenue === 0 && expenses === 0) {
    const baselineRent = tenants.length ? tenants.length * 1500 : properties.length * 1800;
    const baselineExpenses = properties.length * 550;
    if (baselineRent || baselineExpenses) {
      revenue = baselineRent;
      expenses = baselineExpenses;
      estimated = true;
    }
  }

  const net = revenue - expenses;

  return {
    revenue,
    expenses,
    net,
    estimated,
  };
}

function deriveOccupancy(properties = [], tenants = []) {
  const occupancy = { rented: 0, vacant: 0, unknown: 0, total: properties.length, estimated: false };

  properties.forEach((property) => {
    const status = String(
      property.status ?? property.occupancy_status ?? property.occupancy ?? property.availability ?? ""
    ).toLowerCase();

    const tenantCount = coerceNumber(
      property.tenant_count ?? property.tenants_count ?? property.current_tenants ?? property.occupied_units
    );

    if (tenantCount) {
      occupancy.rented += 1;
      return;
    }

    if (tenantCount === 0 && property.hasOwnProperty("tenant_count")) {
      occupancy.vacant += 1;
      return;
    }

    if (property.is_vacant === true || property.vacant === true) {
      occupancy.vacant += 1;
      return;
    }

    if (property.is_vacant === false || property.occupied === true) {
      occupancy.rented += 1;
      return;
    }

    if (status.includes("vacant") || status.includes("available") || status.includes("empty")) {
      occupancy.vacant += 1;
      return;
    }

    if (status.includes("occupied") || status.includes("rented") || status.includes("leased")) {
      occupancy.rented += 1;
      return;
    }

    occupancy.unknown += 1;
  });

  if (occupancy.rented + occupancy.vacant === 0 && occupancy.total > 0) {
    occupancy.rented = Math.min(tenants.length, occupancy.total);
    occupancy.vacant = Math.max(occupancy.total - occupancy.rented, 0);
    occupancy.unknown = 0;
    occupancy.estimated = true;
  }

  const totalUnits = occupancy.total || occupancy.rented + occupancy.vacant;
  occupancy.total = totalUnits;
  occupancy.rate = totalUnits ? Math.round((occupancy.rented / totalUnits) * 100) : 0;
  occupancy.vacancyRate = totalUnits ? Math.round((occupancy.vacant / totalUnits) * 100) : 0;

  return occupancy;
}

export function computePortfolioMetrics({ properties = [], tenants = [], tasks = [], reminders = [] } = {}) {
  const normalizedProperties = normalizeCollection(properties);
  const normalizedTenants = normalizeCollection(tenants);
  const normalizedTasks = normalizeCollection(tasks);
  const normalizedReminders = normalizeCollection(reminders);

  return {
    propertyCount: normalizedProperties.length,
    tenantCount: normalizedTenants.length,
    taskCount: normalizedTasks.length,
    reminderCount: normalizedReminders.length,
    financials: deriveFinancials(normalizedProperties, normalizedTenants),
    occupancy: deriveOccupancy(normalizedProperties, normalizedTenants),
  };
}

export function formatCurrency(amount) {
  const number = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
}

export function usePortfolioMetrics(dependencies) {
  return useMemo(() => computePortfolioMetrics(dependencies), [dependencies]);
}

function formatKeyList(keys = []) {
  const uniqueKeys = Array.from(new Set(keys)).filter(Boolean);
  if (uniqueKeys.length === 0) return "";
  if (uniqueKeys.length === 1) return uniqueKeys[0];
  const initial = uniqueKeys.slice(0, -1).join(", ");
  const last = uniqueKeys[uniqueKeys.length - 1];
  return `${initial}${uniqueKeys.length > 2 ? "," : ""} and ${last}`;
}

export function summarizeSnapshotErrors(details = [], allKeys = []) {
  if (!details.length) return "";

  const normalizedDetails = details.map(({ key, message }) => ({
    key,
    message: String(message ?? "").trim(),
  }));

  const networkPatterns = ["failed to fetch", "network", "cors"];
  const offlineKeys = new Set();
  const otherIssues = [];

  normalizedDetails.forEach(({ key, message }) => {
    const normalizedMessage = message.toLowerCase();
    if (networkPatterns.some((pattern) => normalizedMessage.includes(pattern))) {
      offlineKeys.add(key);
      return;
    }
    otherIssues.push({ key, message });
  });

  const segments = [];

  if (offlineKeys.size) {
    const offlineList = formatKeyList(Array.from(offlineKeys));
    const allKeysMatched = allKeys.length && offlineKeys.size === allKeys.length;
    const offlineMessage = allKeysMatched
      ? "Live dashboard data is unavailable right now. Showing sample portfolio metrics until the connection is restored."
      : `Live data for ${offlineList} is temporarily unavailable. Showing sample portfolio metrics for those sources.`;
    segments.push(offlineMessage);
  }

  otherIssues.forEach(({ key, message }) => {
    const cleaned = message.replace(/\.$/, "");
    segments.push(`Issue loading ${key}: ${cleaned}.`);
  });

  return segments.join(" ").trim();
}

export async function fetchPortfolioSnapshot() {
  const requests = [
    { key: "properties", runner: apiGetProperties },
    { key: "tenants", runner: apiGetTenants },
    { key: "tasks", runner: apiGetTasks },
    { key: "reminders", runner: apiGetReminders },
  ];

  const settled = await Promise.allSettled(requests.map((item) => item.runner()));

  const errors = [];
  const errorDetails = [];
  const collections = {};

  settled.forEach((result, index) => {
    const key = requests[index].key;
    if (result.status === "fulfilled") {
      collections[key] = normalizeCollection(result.value);
    } else {
      collections[key] = [];
      const reason = result.reason;
      const message = reason?.message || reason?.toString?.() || "Unknown error";
      const cleanedMessage = String(message).replace(/^TypeError:\s*/, "").trim();
      errors.push(`${key}: ${cleanedMessage}`);
      errorDetails.push({ key, message: cleanedMessage });
    }
  });

  const metrics = computePortfolioMetrics(collections);
  const errorSummary = summarizeSnapshotErrors(errorDetails, requests.map((item) => item.key));

  return {
    ...collections,
    metrics,
    errors,
    errorSummary,
  };
}

export { normalizeCollection };

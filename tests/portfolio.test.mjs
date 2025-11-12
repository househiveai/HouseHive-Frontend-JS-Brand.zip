import test from "node:test";
import assert from "node:assert/strict";
import {
  computePortfolioMetrics,
  createEmptyMetrics,
  formatCurrency,
  summarizeSnapshotErrors,
} from "../lib/portfolio.js";

const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

test("createEmptyMetrics returns isolated objects", () => {
  const first = createEmptyMetrics();
  const second = createEmptyMetrics();

  assert.ok(isPlainObject(first));
  assert.ok(isPlainObject(first.financials));
  assert.ok(isPlainObject(first.occupancy));

  assert.deepEqual(first, second);
  assert.notStrictEqual(first.financials, second.financials);
  assert.notStrictEqual(first.occupancy, second.occupancy);

  first.financials.revenue = 9999;
  assert.notEqual(first.financials.revenue, second.financials.revenue);
});

test("computePortfolioMetrics aggregates counts and finances", () => {
  const metrics = computePortfolioMetrics({
    properties: [
      { id: 1, status: "occupied", monthly_rent: 2000, monthly_expenses: 500 },
      { id: 2, status: "vacant" },
    ],
    tenants: [
      { id: 101, property_id: 1, monthly_rent: "2000" },
    ],
    tasks: [{ id: "t-1" }, { id: "t-2" }],
    reminders: [{ id: "r-1" }],
  });

  assert.equal(metrics.propertyCount, 2);
  assert.equal(metrics.tenantCount, 1);
  assert.equal(metrics.taskCount, 2);
  assert.equal(metrics.reminderCount, 1);
  assert.equal(metrics.financials.revenue, 4000);
  assert.equal(metrics.financials.expenses, 500);
  assert.equal(metrics.financials.net, 3500);
  assert.equal(metrics.financials.estimated, false);
  assert.equal(metrics.occupancy.rented, 1);
  assert.equal(metrics.occupancy.vacant, 1);
  assert.equal(metrics.occupancy.rate, 50);
  assert.equal(metrics.occupancy.vacancyRate, 50);
});

test("computePortfolioMetrics falls back to estimated baselines", () => {
  const metrics = computePortfolioMetrics({ properties: [{ id: 1 }, { id: 2 }], tenants: [] });

  assert.equal(metrics.financials.estimated, true);
  assert.equal(metrics.financials.revenue, 3600);
  assert.equal(metrics.financials.expenses, 1100);
});

test("formatCurrency renders USD without decimals", () => {
  assert.equal(formatCurrency(1234.56), "$1,235");
  assert.equal(formatCurrency(-987.4), "-$987");
});

test("summarizeSnapshotErrors groups network issues and surfaces specifics", () => {
  const summary = summarizeSnapshotErrors(
    [
      { key: "properties", message: "Failed to fetch" },
      { key: "tenants", message: "Failed to fetch" },
      { key: "tasks", message: "Timed out" },
    ],
    ["properties", "tenants", "tasks", "reminders"],
  );

  assert.match(
    summary,
    /Live data for properties and tenants is temporarily unavailable\. Showing sample portfolio metrics for those sources\./,
  );
  assert.match(summary, /Issue loading tasks: Timed out\./);
});

test("summarizeSnapshotErrors marks full outages as demo data", () => {
  const summary = summarizeSnapshotErrors(
    [
      { key: "properties", message: "Failed to fetch" },
      { key: "tenants", message: "Failed to fetch" },
      { key: "tasks", message: "Failed to fetch" },
      { key: "reminders", message: "Failed to fetch" },
    ],
    ["properties", "tenants", "tasks", "reminders"],
  );

  assert.equal(
    summary,
    "Live dashboard data is unavailable right now. Showing sample portfolio metrics until the connection is restored.",
  );
});

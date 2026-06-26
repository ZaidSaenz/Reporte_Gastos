// ============================================================
// LOCAL APPLICATION STORAGE
// ============================================================
//
// Expenses and settings are stored only in the current browser.
// localStorage is persistent but not encrypted. Clearing browser
// data removes the stored information.
//
// ============================================================

const STORAGE_KEYS = Object.freeze({
  EXPENSES: "expense_tracker_expenses_v1",
  RECENT_CATEGORIES: "expense_tracker_recent_categories_v1",
  SETTINGS: "expense_tracker_settings_v1"
});

const RECENT_CATEGORIES_LIMIT = 6;

const DEFAULT_SETTINGS = Object.freeze({
  language: "es",
  visualStyle: "modern",
  palette: "magenta",
  currency: "MXN",
  monthlyBudget: 0,
  addButtonIcon: "default"
});

function readJSON(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);

    return storedValue !== null
      ? JSON.parse(storedValue)
      : defaultValue;
  } catch (error) {
    console.error(
      `Unable to read local storage key "${key}":`,
      error
    );

    return defaultValue;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Unable to save local storage key "${key}":`,
      error
    );

    return false;
  }
}

function createExpenseId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function getLocalDateKey(date = new Date()) {
  const value =
    date instanceof Date
      ? date
      : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1)
    .padStart(2, "0");
  const day = String(value.getDate())
    .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createLocalDateFromKey(dateKey) {
  if (
    typeof dateKey !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)
  ) {
    return null;
  }

  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function normalizeStoredExpense(expense) {
  const amount = Number(expense?.amount);
  const date =
    typeof expense?.date === "string"
      ? expense.date
      : getLocalDateKey();

  return {
    id:
      String(expense?.id || createExpenseId()),

    amount:
      Number.isFinite(amount) && amount > 0
        ? Number(amount.toFixed(2))
        : 0,

    categoryId:
      String(expense?.categoryId || ""),

    subcategoryId:
      String(expense?.subcategoryId || ""),

    customCategory:
      String(expense?.customCategory || "").trim(),

    customSubcategory:
      String(expense?.customSubcategory || "").trim(),

    description:
      String(expense?.description || "").trim(),

    date,

    createdAt:
      String(
        expense?.createdAt ||
        new Date().toISOString()
      ),

    updatedAt:
      expense?.updatedAt
        ? String(expense.updatedAt)
        : ""
  };
}

function getExpenses() {
  const storedExpenses = readJSON(
    STORAGE_KEYS.EXPENSES,
    []
  );

  if (!Array.isArray(storedExpenses)) {
    return [];
  }

  return storedExpenses
    .map(normalizeStoredExpense)
    .filter(
      (expense) =>
        expense.amount > 0 &&
        expense.categoryId
    )
    .sort(
      (left, right) =>
        new Date(right.createdAt) -
        new Date(left.createdAt)
    );
}

function saveExpenses(expenses) {
  if (!Array.isArray(expenses)) {
    console.error(
      "Expenses must be stored as an array."
    );

    return false;
  }

  return writeJSON(
    STORAGE_KEYS.EXPENSES,
    expenses.map(normalizeStoredExpense)
  );
}

function addExpense(expense) {
  const expenses = getExpenses();

  const newExpense = normalizeStoredExpense({
    ...expense,
    id: expense?.id || createExpenseId(),
    createdAt:
      expense?.createdAt ||
      new Date().toISOString()
  });

  if (
    newExpense.amount <= 0 ||
    !newExpense.categoryId
  ) {
    return false;
  }

  expenses.unshift(newExpense);

  return saveExpenses(expenses);
}

function getExpenseById(expenseId) {
  return (
    getExpenses().find(
      (expense) => expense.id === expenseId
    ) || null
  );
}

function updateExpenseById(
  expenseId,
  changes
) {
  let expenseFound = false;

  const updatedExpenses = getExpenses()
    .map((expense) => {
      if (expense.id !== expenseId) {
        return expense;
      }

      expenseFound = true;

      return normalizeStoredExpense({
        ...expense,
        ...changes,
        id: expense.id,
        createdAt: expense.createdAt,
        updatedAt: new Date().toISOString()
      });
    });

  if (!expenseFound) {
    return false;
  }

  return saveExpenses(updatedExpenses);
}

function deleteExpenseById(expenseId) {
  const expenses = getExpenses();

  const updatedExpenses = expenses.filter(
    (expense) => expense.id !== expenseId
  );

  if (
    updatedExpenses.length ===
    expenses.length
  ) {
    return false;
  }

  return saveExpenses(updatedExpenses);
}

function getExpensesByDate(date) {
  const targetDate =
    typeof date === "string"
      ? date
      : getLocalDateKey(date);

  if (!targetDate) {
    return [];
  }

  return getExpenses().filter(
    (expense) => expense.date === targetDate
  );
}

function getTodayExpenses() {
  return getExpensesByDate(
    getLocalDateKey()
  );
}

function calculateExpenseTotal(expenses) {
  if (!Array.isArray(expenses)) {
    return 0;
  }

  return Number(
    expenses.reduce(
      (total, expense) =>
        total +
        (Number(expense.amount) || 0),
      0
    ).toFixed(2)
  );
}

function getRecentCategories() {
  const recentCategories = readJSON(
    STORAGE_KEYS.RECENT_CATEGORIES,
    []
  );

  return Array.isArray(recentCategories)
    ? recentCategories
    : [];
}

function registerRecentCategory({
  categoryId,
  subcategoryId = "",
  customCategory = "",
  customSubcategory = ""
}) {
  if (!categoryId) {
    return false;
  }

  const newItem = {
    categoryId,
    subcategoryId,
    customCategory:
      String(customCategory).trim(),
    customSubcategory:
      String(customSubcategory).trim()
  };

  let recentCategories =
    getRecentCategories();

  recentCategories = recentCategories.filter(
    (item) =>
      !(
        item.categoryId ===
          newItem.categoryId &&
        item.subcategoryId ===
          newItem.subcategoryId &&
        item.customCategory ===
          newItem.customCategory &&
        item.customSubcategory ===
          newItem.customSubcategory
      )
  );

  recentCategories.unshift(newItem);

  return writeJSON(
    STORAGE_KEYS.RECENT_CATEGORIES,
    recentCategories.slice(
      0,
      RECENT_CATEGORIES_LIMIT
    )
  );
}

function getSettings() {
  const savedSettings = readJSON(
    STORAGE_KEYS.SETTINGS,
    {}
  );

  return {
    ...DEFAULT_SETTINGS,
    ...(
      savedSettings &&
      typeof savedSettings === "object"
        ? savedSettings
        : {}
    )
  };
}

function saveSettings(changes) {
  const nextSettings = {
    ...getSettings(),
    ...changes
  };

  return writeJSON(
    STORAGE_KEYS.SETTINGS,
    nextSettings
  );
}

function createLocalBackup() {
  return {
    application: "expense-tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    expenses: getExpenses(),
    recentCategories: getRecentCategories(),
    settings: getSettings()
  };
}

function restoreLocalBackup(backup) {
  if (
    !backup ||
    backup.application !==
      "expense-tracker" ||
    backup.version !== 1 ||
    !Array.isArray(backup.expenses)
  ) {
    return false;
  }

  const expensesSaved = saveExpenses(
    backup.expenses
  );

  const categoriesSaved = writeJSON(
    STORAGE_KEYS.RECENT_CATEGORIES,
    Array.isArray(
      backup.recentCategories
    )
      ? backup.recentCategories
      : []
  );

  const settingsSaved = saveSettings(
    backup.settings || {}
  );

  return (
    expensesSaved &&
    categoriesSaved &&
    settingsSaved
  );
}

function clearApplicationData() {
  try {
    Object.values(STORAGE_KEYS)
      .forEach(
        (key) =>
          localStorage.removeItem(key)
      );

    return true;
  } catch (error) {
    console.error(
      "Unable to clear application data:",
      error
    );

    return false;
  }
}

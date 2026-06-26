// ============================================================
// DEFAULT EXPENSE CATEGORIES
// ============================================================
//
// Category and subcategory IDs are persistent data identifiers.
// Do not rename existing IDs after releasing the application.
// Visible labels are provided by the translation module.
//
// ============================================================

const EXPENSE_CATEGORIES = Object.freeze([
  {
    id: "food",
    subcategories: [
      "groceries",
      "restaurants",
      "delivery",
      "snacks",
      "other"
    ]
  },
  {
    id: "transportation",
    subcategories: [
      "fuel",
      "publicTransport",
      "taxi",
      "parking",
      "vehicleMaintenance",
      "other"
    ]
  },
  {
    id: "home",
    subcategories: [
      "rent",
      "cleaning",
      "repairs",
      "furniture",
      "householdItems",
      "other"
    ]
  },
  {
    id: "services",
    subcategories: [
      "electricity",
      "water",
      "gasService",
      "internet",
      "phone",
      "subscriptions",
      "other"
    ]
  },
  {
    id: "health",
    subcategories: [
      "medicine",
      "medicalConsultation",
      "dental",
      "laboratory",
      "personalCare",
      "other"
    ]
  },
  {
    id: "personal",
    subcategories: [
      "clothing",
      "footwear",
      "beauty",
      "gifts",
      "other"
    ]
  },
  {
    id: "entertainment",
    subcategories: [
      "movies",
      "games",
      "events",
      "hobbies",
      "travel",
      "other"
    ]
  },
  {
    id: "education",
    subcategories: [
      "courses",
      "books",
      "schoolSupplies",
      "tuition",
      "other"
    ]
  },
  {
    id: "financial",
    subcategories: [
      "debtPayment",
      "bankFees",
      "insurance",
      "taxes",
      "other"
    ]
  },
  {
    id: "other",
    custom: true,
    subcategories: []
  }
]);

const EXPENSE_CATEGORY_INDEX = new Map(
  EXPENSE_CATEGORIES.map(
    (category) => [category.id, category]
  )
);

function getExpenseCategories() {
  return EXPENSE_CATEGORIES;
}

function getExpenseCategoryById(categoryId) {
  return EXPENSE_CATEGORY_INDEX.get(categoryId) || null;
}

function getExpenseSubcategories(categoryId) {
  const category = getExpenseCategoryById(categoryId);

  return category
    ? category.subcategories
    : [];
}

function isCustomExpenseCategory(categoryId) {
  return Boolean(
    getExpenseCategoryById(categoryId)?.custom
  );
}

function isCustomExpenseSubcategory(subcategoryId) {
  return subcategoryId === "other";
}

function isValidExpenseCategory(categoryId) {
  return EXPENSE_CATEGORY_INDEX.has(categoryId);
}

function isValidExpenseSubcategory(
  categoryId,
  subcategoryId
) {
  if (!subcategoryId) {
    return true;
  }

  return getExpenseSubcategories(categoryId)
    .includes(subcategoryId);
}

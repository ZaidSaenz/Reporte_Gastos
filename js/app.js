// ============================================================
// EXPENSE TRACKER APPLICATION
// ============================================================

const applicationState = {
  selectedCategoryId: "",
  selectedSubcategoryId: "",
  editingExpenseId: ""
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeSettings();
    initializeExpenseForm();
    refreshApplication();
    registerServiceWorker();
  }
);

function initializeExpenseForm() {
  const dateInput =
    document.querySelector(
      "#expense-date"
    );

  if (dateInput) {
    dateInput.value =
      getLocalDateKey();
  }

  document
    .querySelector(
      "#save-expense-button"
    )
    ?.addEventListener(
      "click",
      saveExpenseFromForm
    );

  document
    .querySelector(
      "#cancel-edit-button"
    )
    ?.addEventListener(
      "click",
      resetExpenseForm
    );

  document
    .querySelector(
      "#expense-amount"
    )
    ?.addEventListener(
      "blur",
      formatAmountInput
    );

  document.addEventListener(
    "settingschanged",
    () => {
      refreshApplication();
    }
  );
}

function normalizeAmount(value) {
  const text = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[$€£¥]/g, "");

  if (
    !/^\d+(?:[.,]\d{0,2})?$/.test(
      text
    )
  ) {
    return null;
  }

  const amount = Number(
    text.replace(",", ".")
  );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return Number(amount.toFixed(2));
}

function formatAmountInput() {
  const input =
    document.querySelector(
      "#expense-amount"
    );

  if (!input) {
    return;
  }

  const amount =
    normalizeAmount(input.value);

  if (amount !== null) {
    input.value =
      amount.toFixed(2);
  }
}

function renderCategorySelector() {
  const container =
    document.querySelector(
      "#category-selector"
    );

  if (!container) {
    return;
  }

  container.replaceChildren();

  getExpenseCategories()
    .forEach((category) => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";
      button.className =
        "category-option";

      button.classList.toggle(
        "is-selected",
        applicationState
          .selectedCategoryId ===
          category.id
      );

      button.textContent =
        getCategoryLabel(category.id);

      button.addEventListener(
        "click",
        () =>
          selectExpenseCategory(
            category.id
          )
      );

      container.append(button);
    });

  renderSubcategorySelector();
  updateCustomFields();
}

function renderSubcategorySelector() {
  const section =
    document.querySelector(
      "#subcategory-section"
    );

  const container =
    document.querySelector(
      "#subcategory-selector"
    );

  if (!section || !container) {
    return;
  }

  const subcategories =
    getExpenseSubcategories(
      applicationState
        .selectedCategoryId
    );

  section.classList.toggle(
    "is-hidden",
    subcategories.length === 0
  );

  container.replaceChildren();

  subcategories.forEach(
    (subcategoryId) => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";
      button.className =
        "subcategory-option";

      button.classList.toggle(
        "is-selected",
        applicationState
          .selectedSubcategoryId ===
          subcategoryId
      );

      button.textContent =
        getSubcategoryLabel(
          subcategoryId
        );

      button.addEventListener(
        "click",
        () =>
          selectExpenseSubcategory(
            subcategoryId
          )
      );

      container.append(button);
    }
  );
}

function selectExpenseCategory(
  categoryId
) {
  applicationState
    .selectedCategoryId =
      categoryId;

  applicationState
    .selectedSubcategoryId = "";

  renderCategorySelector();
}

function selectExpenseSubcategory(
  subcategoryId
) {
  applicationState
    .selectedSubcategoryId =
      subcategoryId;

  renderSubcategorySelector();
  updateCustomFields();
}

function updateCustomFields() {
  const customCategoryField =
    document.querySelector(
      "#custom-category-field"
    );

  const customSubcategoryField =
    document.querySelector(
      "#custom-subcategory-field"
    );

  customCategoryField
    ?.classList.toggle(
      "is-hidden",
      !isCustomExpenseCategory(
        applicationState
          .selectedCategoryId
      )
    );

  customSubcategoryField
    ?.classList.toggle(
      "is-hidden",
      !isCustomExpenseSubcategory(
        applicationState
          .selectedSubcategoryId
      )
    );
}

function readExpenseForm() {
  const amount =
    normalizeAmount(
      document.querySelector(
        "#expense-amount"
      )?.value
    );

  const categoryId =
    applicationState
      .selectedCategoryId;

  const subcategoryId =
    applicationState
      .selectedSubcategoryId;

  const customCategory =
    document.querySelector(
      "#custom-category"
    )?.value.trim() || "";

  const customSubcategory =
    document.querySelector(
      "#custom-subcategory"
    )?.value.trim() || "";

  const description =
    document.querySelector(
      "#expense-description"
    )?.value.trim() || "";

  const date =
    document.querySelector(
      "#expense-date"
    )?.value || getLocalDateKey();

  if (amount === null) {
    showAppMessage(
      t("expense.invalidAmount"),
      true
    );

    document
      .querySelector(
        "#expense-amount"
      )
      ?.focus();

    return null;
  }

  if (!categoryId) {
    showAppMessage(
      t("expense.categoryRequired"),
      true
    );

    return null;
  }

  if (
    isCustomExpenseCategory(
      categoryId
    ) &&
    !customCategory
  ) {
    showAppMessage(
      t(
        "expense.customCategoryRequired"
      ),
      true
    );

    document
      .querySelector(
        "#custom-category"
      )
      ?.focus();

    return null;
  }

  if (
    isCustomExpenseSubcategory(
      subcategoryId
    ) &&
    !customSubcategory
  ) {
    showAppMessage(
      t(
        "expense.customSubcategoryRequired"
      ),
      true
    );

    document
      .querySelector(
        "#custom-subcategory"
      )
      ?.focus();

    return null;
  }

  return {
    amount,
    categoryId,
    subcategoryId,
    customCategory,
    customSubcategory,
    description,
    date
  };
}

function saveExpenseFromForm() {
  const expense =
    readExpenseForm();

  if (!expense) {
    return;
  }

  const isEditing =
    Boolean(
      applicationState
        .editingExpenseId
    );

  const saved = isEditing
    ? updateExpenseById(
        applicationState
          .editingExpenseId,
        expense
      )
    : addExpense(expense);

  if (!saved) {
    showAppMessage(
      t("expense.saveError"),
      true
    );

    return;
  }

  registerRecentCategory(
    expense
  );

  resetExpenseForm();
  refreshApplication();

  showAppMessage(
    t(
      isEditing
        ? "expense.updated"
        : "expense.saved"
    )
  );
}

function resetExpenseForm() {
  applicationState
    .selectedCategoryId = "";

  applicationState
    .selectedSubcategoryId = "";

  applicationState
    .editingExpenseId = "";

  const form =
    document.querySelector(
      "#expense-form"
    );

  form?.reset();

  const dateInput =
    document.querySelector(
      "#expense-date"
    );

  if (dateInput) {
    dateInput.value =
      getLocalDateKey();
  }

  document
    .querySelector(
      "#save-expense-button"
    )
    ?.setAttribute(
      "data-i18n",
      "expense.save"
    );

  document
    .querySelector(
      "#cancel-edit-button"
    )
    ?.classList.add(
      "is-hidden"
    );

  renderCategorySelector();
  applyTranslations();
}

function editExpense(expenseId) {
  const expense =
    getExpenseById(expenseId);

  if (!expense) {
    return;
  }

  applicationState
    .editingExpenseId =
      expense.id;

  applicationState
    .selectedCategoryId =
      expense.categoryId;

  applicationState
    .selectedSubcategoryId =
      expense.subcategoryId;

  document.querySelector(
    "#expense-amount"
  ).value =
    Number(expense.amount)
      .toFixed(2);

  document.querySelector(
    "#custom-category"
  ).value =
    expense.customCategory;

  document.querySelector(
    "#custom-subcategory"
  ).value =
    expense.customSubcategory;

  document.querySelector(
    "#expense-description"
  ).value =
    expense.description;

  document.querySelector(
    "#expense-date"
  ).value =
    expense.date;

  document
    .querySelector(
      "#save-expense-button"
    )
    ?.setAttribute(
      "data-i18n",
      "expense.update"
    );

  document
    .querySelector(
      "#cancel-edit-button"
    )
    ?.classList.remove(
      "is-hidden"
    );

  renderCategorySelector();
  applyTranslations();

  document
    .querySelector(
      "#new-expense-panel"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

function deleteExpense(expenseId) {
  if (
    !window.confirm(
      t("history.deleteConfirm")
    )
  ) {
    return;
  }

  if (!deleteExpenseById(expenseId)) {
    return;
  }

  if (
    applicationState
      .editingExpenseId ===
      expenseId
  ) {
    resetExpenseForm();
  }

  refreshApplication();

  showAppMessage(
    t("expense.deleted")
  );
}

function renderRecentCategories() {
  const section =
    document.querySelector(
      "#recent-categories-panel"
    );

  const container =
    document.querySelector(
      "#recent-categories"
    );

  if (!section || !container) {
    return;
  }

  const recentCategories =
    getRecentCategories();

  section.classList.toggle(
    "is-hidden",
    recentCategories.length === 0
  );

  container.replaceChildren();

  recentCategories.forEach(
    (item) => {
      const button =
        document.createElement(
          "button"
        );

      const category =
        document.createElement(
          "strong"
        );

      const subcategory =
        document.createElement(
          "span"
        );

      button.type = "button";
      button.className =
        "recent-category-card";

      category.textContent =
        getCategoryLabel(
          item.categoryId,
          item.customCategory
        );

      const subcategoryLabel =
        getSubcategoryLabel(
          item.subcategoryId,
          item.customSubcategory
        );

      subcategory.textContent =
        subcategoryLabel;

      subcategory.classList.toggle(
        "is-hidden",
        !subcategoryLabel
      );

      button.append(
        category,
        subcategory
      );

      button.addEventListener(
        "click",
        () => {
          applicationState
            .selectedCategoryId =
              item.categoryId;

          applicationState
            .selectedSubcategoryId =
              item.subcategoryId;

          document.querySelector(
            "#custom-category"
          ).value =
            item.customCategory || "";

          document.querySelector(
            "#custom-subcategory"
          ).value =
            item.customSubcategory || "";

          renderCategorySelector();

          document
            .querySelector(
              "#expense-amount"
            )
            ?.focus();

          document
            .querySelector(
              "#new-expense-panel"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
        }
      );

      container.append(button);
    }
  );
}

function refreshApplication() {
  applyTranslations();
  renderCategorySelector();

  const expenses =
    getExpenses();

  renderDashboardSummary(expenses);

  renderExpenseHistory(
    expenses,
    {
      onEdit: editExpense,
      onDelete: deleteExpense,
      onCopy: copyDailyHistory
    }
  );

  renderRecentCategories();
}

function showAppMessage(
  text,
  isError = false
) {
  const message =
    document.querySelector(
      "#app-message"
    );

  if (!message) {
    return;
  }

  message.textContent = text;
  message.classList.toggle(
    "is-error",
    isError
  );
}

function registerServiceWorker() {
  if (
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .catch((error) => {
          console.error(
            "Unable to register the service worker:",
            error
          );
        });
    }
  );
}

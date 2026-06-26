// ============================================================
// EXPENSE TRACKER APPLICATION
// ============================================================

const applicationState = {
  selectedCategoryId: "",
  selectedSubcategoryId: "",
  editingExpenseId: "",
  detailsExpenseId: "",
  messageTimerId: null
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeApplicationInterface();
    initializeSettings();
    refreshApplication();
    registerServiceWorker();
  }
);

function initializeApplicationInterface() {
  document
    .querySelector("#open-expense-button")
    ?.addEventListener(
      "click",
      openNewExpenseDialog
    );

  document
    .querySelector("#close-expense-button")
    ?.addEventListener(
      "click",
      closeExpenseDialog
    );

  document
    .querySelector("#save-expense-button")
    ?.addEventListener(
      "click",
      saveExpenseFromForm
    );

  document
    .querySelector("#cancel-edit-button")
    ?.addEventListener(
      "click",
      openNewExpenseDialog
    );

  document
    .querySelector("#expense-amount")
    ?.addEventListener(
      "blur",
      formatAmountInput
    );

  document
    .querySelector("#open-history-button")
    ?.addEventListener(
      "click",
      openHistoryDialog
    );

  document
    .querySelector("#close-history-button")
    ?.addEventListener(
      "click",
      closeHistoryDialog
    );

  document
    .querySelector(
      "#close-expense-details-button"
    )
    ?.addEventListener(
      "click",
      closeExpenseDetailsDialog
    );

  document
    .querySelector(
      "#edit-expense-detail-button"
    )
    ?.addEventListener(
      "click",
      () => editExpense(
        applicationState.detailsExpenseId
      )
    );

  document
    .querySelector(
      "#delete-expense-detail-button"
    )
    ?.addEventListener(
      "click",
      () => deleteExpense(
        applicationState.detailsExpenseId
      )
    );

  [
    "#expense-dialog",
    "#expense-details-dialog",
    "#settings-dialog"
  ].forEach((selector) => {
    document
      .querySelector(selector)
      ?.addEventListener(
        "click",
        (event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close?.();
          }
        }
      );
  });

  document.addEventListener(
    "settingschanged",
    refreshApplication
  );

  setDefaultExpenseDate();
  renderCategorySelector();
}

function openDialog(dialog) {
  if (!dialog) {
    return;
  }

  if (
    typeof dialog.showModal === "function"
  ) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (!dialog) {
    return;
  }

  if (typeof dialog.close === "function") {
    if (dialog.open) {
      dialog.close();
    }
  } else {
    dialog.removeAttribute("open");
  }
}

function openNewExpenseDialog() {
  resetExpenseForm();
  openDialog(
    document.querySelector(
      "#expense-dialog"
    )
  );

  requestAnimationFrame(() => {
    document
      .querySelector("#expense-amount")
      ?.focus();
  });
}

function closeExpenseDialog() {
  closeDialog(
    document.querySelector(
      "#expense-dialog"
    )
  );
}

function openHistoryDialog() {
  refreshApplication();
  openDialog(
    document.querySelector(
      "#history-dialog"
    )
  );
}

function closeHistoryDialog() {
  closeDialog(
    document.querySelector(
      "#history-dialog"
    )
  );
}

function openExpenseDetails(expenseId) {
  const expense = getExpenseById(expenseId);

  if (!expense) {
    return;
  }

  applicationState.detailsExpenseId =
    expenseId;

  renderExpenseDetails(expense);

  openDialog(
    document.querySelector(
      "#expense-details-dialog"
    )
  );
}

function closeExpenseDetailsDialog() {
  applicationState.detailsExpenseId = "";

  closeDialog(
    document.querySelector(
      "#expense-details-dialog"
    )
  );
}

function normalizeAmount(value) {
  const text = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[$€£¥]/g, "");

  if (!/^\d+(?:[.,]\d{0,2})?$/.test(text)) {
    return null;
  }

  const amount = Number(
    text.replace(",", ".")
  );

  if (!Number.isFinite(amount) || amount <= 0) {
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

  const amount = normalizeAmount(input.value);

  if (amount !== null) {
    input.value = amount.toFixed(2);
  }
}

function setDefaultExpenseDate() {
  const dateInput =
    document.querySelector(
      "#expense-date"
    );

  if (dateInput) {
    dateInput.value = getLocalDateKey();
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

  getExpenseCategories().forEach(
    (category) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "category-option";
      button.textContent =
        getCategoryLabel(category.id);

      button.classList.toggle(
        "is-selected",
        applicationState.selectedCategoryId ===
          category.id
      );

      button.addEventListener(
        "click",
        () => selectExpenseCategory(
          category.id
        )
      );

      container.append(button);
    }
  );

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
      applicationState.selectedCategoryId
    );

  section.classList.toggle(
    "is-hidden",
    subcategories.length === 0
  );

  container.replaceChildren();

  subcategories.forEach(
    (subcategoryId) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "subcategory-option";
      button.textContent =
        getSubcategoryLabel(
          subcategoryId
        );

      button.classList.toggle(
        "is-selected",
        applicationState
          .selectedSubcategoryId ===
          subcategoryId
      );

      button.addEventListener(
        "click",
        () => selectExpenseSubcategory(
          subcategoryId
        )
      );

      container.append(button);
    }
  );
}

function selectExpenseCategory(categoryId) {
  applicationState.selectedCategoryId =
    categoryId;
  applicationState.selectedSubcategoryId =
    "";

  renderCategorySelector();
}

function selectExpenseSubcategory(
  subcategoryId
) {
  applicationState.selectedSubcategoryId =
    subcategoryId;

  renderSubcategorySelector();
  updateCustomFields();
}

function updateCustomFields() {
  document
    .querySelector(
      "#custom-category-field"
    )
    ?.classList.toggle(
      "is-hidden",
      !isCustomExpenseCategory(
        applicationState.selectedCategoryId
      )
    );

  document
    .querySelector(
      "#custom-subcategory-field"
    )
    ?.classList.toggle(
      "is-hidden",
      !isCustomExpenseSubcategory(
        applicationState.selectedSubcategoryId
      )
    );
}

function readExpenseForm() {
  const amount = normalizeAmount(
    document.querySelector(
      "#expense-amount"
    )?.value
  );

  const categoryId =
    applicationState.selectedCategoryId;

  const subcategoryId =
    applicationState.selectedSubcategoryId;

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
      .querySelector("#expense-amount")
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
    isCustomExpenseCategory(categoryId) &&
    !customCategory
  ) {
    showAppMessage(
      t("expense.customCategoryRequired"),
      true
    );
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
  const expense = readExpenseForm();

  if (!expense) {
    return;
  }

  const isEditing = Boolean(
    applicationState.editingExpenseId
  );

  const saved = isEditing
    ? updateExpenseById(
        applicationState.editingExpenseId,
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

  registerRecentCategory(expense);
  closeExpenseDialog();
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
  applicationState.selectedCategoryId = "";
  applicationState.selectedSubcategoryId = "";
  applicationState.editingExpenseId = "";

  document
    .querySelector("#expense-form")
    ?.reset();

  setDefaultExpenseDate();

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
      "#expense-dialog-title"
    )
    ?.setAttribute(
      "data-i18n",
      "expense.title"
    );

  document
    .querySelector(
      "#cancel-edit-button"
    )
    ?.classList.add("is-hidden");

  document
    .querySelector(
      ".expense-more-details"
    )
    ?.removeAttribute("open");

  renderCategorySelector();
  applyTranslations();
}

function editExpense(expenseId) {
  const expense = getExpenseById(expenseId);

  if (!expense) {
    return;
  }

  applicationState.editingExpenseId =
    expense.id;
  applicationState.selectedCategoryId =
    expense.categoryId;
  applicationState.selectedSubcategoryId =
    expense.subcategoryId;

  document.querySelector(
    "#expense-amount"
  ).value = Number(expense.amount)
    .toFixed(2);

  document.querySelector(
    "#custom-category"
  ).value = expense.customCategory;

  document.querySelector(
    "#custom-subcategory"
  ).value = expense.customSubcategory;

  document.querySelector(
    "#expense-description"
  ).value = expense.description;

  document.querySelector(
    "#expense-date"
  ).value = expense.date;

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
    ?.classList.remove("is-hidden");

  renderCategorySelector();
  applyTranslations();

  document
    .querySelector(
      ".expense-more-details"
    )
    ?.setAttribute("open", "");

  closeExpenseDetailsDialog();
  closeHistoryDialog();
  openDialog(
    document.querySelector(
      "#expense-dialog"
    )
  );
}

function deleteExpense(expenseId) {
  if (!expenseId) {
    return;
  }

  if (!window.confirm(
    t("history.deleteConfirm")
  )) {
    return;
  }

  if (!deleteExpenseById(expenseId)) {
    return;
  }

  closeExpenseDetailsDialog();
  refreshApplication();
  showAppMessage(t("expense.deleted"));
}

function refreshApplication() {
  const expenses = getExpenses();

  renderHomeSummary(expenses);

  renderExpenseHistory(
    expenses,
    {
      onDetails: openExpenseDetails,
      onCopy: copyDailyHistory
    }
  );

  if (applicationState.detailsExpenseId) {
    renderExpenseDetails(
      getExpenseById(
        applicationState.detailsExpenseId
      )
    );
  }

  renderCategorySelector();
  applyTranslations();
}

function showAppMessage(
  message,
  isError = false
) {
  const element =
    document.querySelector(
      "#app-message"
    );

  if (!element) {
    return;
  }

  window.clearTimeout(
    applicationState.messageTimerId
  );

  element.textContent = message;
  element.classList.toggle(
    "is-error",
    isError
  );

  applicationState.messageTimerId =
    window.setTimeout(
      () => {
        element.textContent = "";
        element.classList.remove(
          "is-error"
        );
      },
      3200
    );
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .catch((error) => {
          console.error(
            "Unable to register the service worker:",
            error
          );
        });
    }
  );
}

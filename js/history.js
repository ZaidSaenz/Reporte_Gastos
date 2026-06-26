// ============================================================
// HOME SUMMARY AND EXPENSE HISTORY
// ============================================================

function getCurrentMonthExpenses(
  expenses,
  referenceDate = new Date()
) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  return expenses.filter((expense) => {
    const expenseDate =
      createLocalDateFromKey(expense.date);

    return Boolean(
      expenseDate &&
      expenseDate.getFullYear() === year &&
      expenseDate.getMonth() === month
    );
  });
}

function renderHomeSummary(expenses) {
  const currentSpending =
    calculateExpenseTotal(
      getCurrentMonthExpenses(expenses)
    );

  const settings = getSettings();
  const monthlyBudget =
    Number(settings.monthlyBudget) || 0;

  const spendingElement =
    document.querySelector(
      "#current-spending-value"
    );

  const budgetBlock =
    document.querySelector(
      "#remaining-budget-block"
    );

  const budgetValue =
    document.querySelector(
      "#remaining-budget-value"
    );

  if (spendingElement) {
    spendingElement.textContent =
      formatCurrency(currentSpending);
  }

  if (!budgetBlock || !budgetValue) {
    return;
  }

  const hasBudget = monthlyBudget > 0;

  budgetBlock.classList.toggle(
    "is-hidden",
    !hasBudget
  );

  if (hasBudget) {
    budgetValue.textContent =
      formatCurrency(
        monthlyBudget - currentSpending
      );
  }
}

function groupExpensesByDate(expenses) {
  return expenses.reduce(
    (groups, expense) => {
      if (!groups.has(expense.date)) {
        groups.set(expense.date, []);
      }

      groups.get(expense.date).push(expense);

      return groups;
    },
    new Map()
  );
}

function createHistoryRow(
  expense,
  onDetails
) {
  const row =
    document.createElement("article");

  const category =
    document.createElement("strong");

  const amount =
    document.createElement("strong");

  const date =
    document.createElement("span");

  const detailsButton =
    document.createElement("button");

  row.className = "history-row";
  category.className =
    "history-row__category";
  amount.className =
    "history-row__amount";
  date.className = "history-row__date";
  detailsButton.className =
    "history-row__details";

  category.textContent =
    getExpenseCategoryLabel(expense);

  amount.textContent =
    formatCurrency(expense.amount);

  date.textContent =
    `${formatCompactDate(expense.date)} · ` +
    formatTime(expense.createdAt);

  detailsButton.type = "button";
  detailsButton.textContent =
    t("history.details");

  detailsButton.addEventListener(
    "click",
    () => onDetails(expense.id)
  );

  row.append(
    category,
    amount,
    date,
    detailsButton
  );

  return row;
}

function createHistoryDateGroup(
  dateKey,
  expenses,
  callbacks
) {
  const section =
    document.createElement("section");

  const header =
    document.createElement("div");

  const heading =
    document.createElement("h3");

  const actions =
    document.createElement("div");

  const total =
    document.createElement("span");

  const copyButton =
    document.createElement("button");

  const list =
    document.createElement("div");

  section.className =
    "history-date-group";
  header.className =
    "history-date-group__header";
  actions.className =
    "history-date-group__actions";
  total.className =
    "history-date-group__total";
  list.className = "history-list";

  heading.textContent =
    formatFullDate(dateKey);

  total.textContent =
    formatCurrency(
      calculateExpenseTotal(expenses)
    );

  copyButton.type = "button";
  copyButton.className =
    "button button--secondary button--small";
  copyButton.textContent =
    t("history.copy");

  copyButton.addEventListener(
    "click",
    () => callbacks.onCopy(
      dateKey,
      expenses
    )
  );

  expenses.forEach((expense) => {
    list.append(
      createHistoryRow(
        expense,
        callbacks.onDetails
      )
    );
  });

  actions.append(total, copyButton);
  header.append(heading, actions);
  section.append(header, list);

  return section;
}

function renderExpenseHistory(
  expenses,
  callbacks
) {
  const container =
    document.querySelector(
      "#expense-history"
    );

  if (!container) {
    return;
  }

  container.replaceChildren();

  if (expenses.length === 0) {
    const message =
      document.createElement("p");

    message.className = "empty-state";
    message.textContent = t("history.empty");

    container.append(message);
    return;
  }

  const groups =
    groupExpensesByDate(expenses);

  groups.forEach(
    (groupExpenses, dateKey) => {
      container.append(
        createHistoryDateGroup(
          dateKey,
          groupExpenses,
          callbacks
        )
      );
    }
  );
}

function renderExpenseDetails(expense) {
  if (!expense) {
    return;
  }

  const amount =
    document.querySelector(
      "#details-amount"
    );

  const category =
    document.querySelector(
      "#details-category"
    );

  const date =
    document.querySelector(
      "#details-date"
    );

  const description =
    document.querySelector(
      "#details-description"
    );

  if (amount) {
    amount.textContent =
      formatCurrency(expense.amount);
  }

  if (category) {
    category.textContent =
      getExpenseCategoryLabel(expense);
  }

  if (date) {
    date.textContent =
      `${formatFullDate(expense.date)} · ` +
      formatTime(expense.createdAt);
  }

  if (description) {
    description.textContent =
      expense.description ||
      t("history.noDescription");
  }
}

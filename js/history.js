// ============================================================
// DASHBOARD AND EXPENSE HISTORY
// ============================================================

function getStartOfWeek(date = new Date()) {
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const day =
    result.getDay() || 7;

  result.setDate(
    result.getDate() - day + 1
  );

  return result;
}

function getStartOfMonth(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function getExpensesFromDate(
  expenses,
  startDate
) {
  const startKey =
    getLocalDateKey(startDate);

  const todayKey =
    getLocalDateKey();

  return expenses.filter(
    (expense) =>
      expense.date >= startKey &&
      expense.date <= todayKey
  );
}

function calculateDashboardSummary(
  expenses
) {
  const todayKey =
    getLocalDateKey();

  return {
    today: calculateExpenseTotal(
      expenses.filter(
        (expense) =>
          expense.date === todayKey
      )
    ),

    week: calculateExpenseTotal(
      getExpensesFromDate(
        expenses,
        getStartOfWeek()
      )
    ),

    month: calculateExpenseTotal(
      getExpensesFromDate(
        expenses,
        getStartOfMonth()
      )
    )
  };
}

function createSummaryItem(
  value,
  label
) {
  const container =
    document.createElement("div");

  const valueElement =
    document.createElement("strong");

  const labelElement =
    document.createElement("span");

  container.className =
    "summary-item";

  valueElement.textContent =
    formatCurrency(value);

  labelElement.textContent =
    label;

  container.append(
    valueElement,
    labelElement
  );

  return container;
}

function renderDashboardSummary(
  expenses
) {
  const container =
    document.querySelector(
      "#expense-summary"
    );

  if (!container) {
    return;
  }

  const summary =
    calculateDashboardSummary(
      expenses
    );

  container.replaceChildren(
    createSummaryItem(
      summary.today,
      t("dashboard.today")
    ),
    createSummaryItem(
      summary.week,
      t("dashboard.week")
    ),
    createSummaryItem(
      summary.month,
      t("dashboard.month")
    )
  );
}

function groupExpensesByDate(expenses) {
  return expenses.reduce(
    (groups, expense) => {
      if (!groups.has(expense.date)) {
        groups.set(
          expense.date,
          []
        );
      }

      groups
        .get(expense.date)
        .push(expense);

      return groups;
    },
    new Map()
  );
}

function createExpenseHistoryCard(
  expense,
  {
    onEdit,
    onDelete
  }
) {
  const card =
    document.createElement("article");

  const header =
    document.createElement("div");

  const time =
    document.createElement("span");

  const amount =
    document.createElement("strong");

  const category =
    document.createElement("p");

  const description =
    document.createElement("p");

  const actions =
    document.createElement("div");

  const editButton =
    document.createElement("button");

  const deleteButton =
    document.createElement("button");

  card.className =
    "expense-history-card";

  header.className =
    "expense-history-card__header";

  time.className =
    "expense-history-card__time";

  amount.className =
    "expense-history-card__amount";

  category.className =
    "expense-history-card__category";

  description.className =
    "expense-history-card__description";

  actions.className =
    "expense-history-card__actions";

  editButton.type = "button";
  editButton.className =
    "button button--small button--secondary";
  editButton.textContent =
    t("history.edit");

  deleteButton.type = "button";
  deleteButton.className =
    "button button--small button--danger";
  deleteButton.textContent =
    t("history.delete");

  time.textContent =
    formatTime(expense.createdAt);

  amount.textContent =
    formatCurrency(expense.amount);

  category.textContent =
    getExpenseCategoryLabel(expense);

  description.textContent =
    expense.description ||
    t("history.noDescription");

  editButton.addEventListener(
    "click",
    () => onEdit(expense.id)
  );

  deleteButton.addEventListener(
    "click",
    () => onDelete(expense.id)
  );

  header.append(
    time,
    amount
  );

  actions.append(
    editButton,
    deleteButton
  );

  card.append(
    header,
    category,
    description,
    actions
  );

  return card;
}

function createHistoryDayGroup(
  dateKey,
  expenses,
  callbacks,
  openByDefault
) {
  const details =
    document.createElement("details");

  const summary =
    document.createElement("summary");

  const dateLabel =
    document.createElement("span");

  const total =
    document.createElement("strong");

  const list =
    document.createElement("div");

  const footer =
    document.createElement("div");

  const copyButton =
    document.createElement("button");

  details.className =
    "history-day";

  details.open =
    Boolean(openByDefault);

  summary.className =
    "history-day__summary";

  dateLabel.textContent =
    formatCompactDate(dateKey);

  total.textContent =
    formatCurrency(
      calculateExpenseTotal(expenses)
    );

  list.className =
    "history-day__list";

  footer.className =
    "history-day__footer";

  copyButton.type = "button";
  copyButton.className =
    "button button--secondary button--small";
  copyButton.textContent =
    t("history.copy");

  expenses.forEach(
    (expense) => {
      list.append(
        createExpenseHistoryCard(
          expense,
          callbacks
        )
      );
    }
  );

  copyButton.addEventListener(
    "click",
    () =>
      callbacks.onCopy(
        dateKey,
        expenses
      )
  );

  summary.append(
    dateLabel,
    total
  );

  footer.append(copyButton);

  details.append(
    summary,
    list,
    footer
  );

  return details;
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

    message.className =
      "empty-state";

    message.textContent =
      t("history.empty");

    container.append(message);

    return;
  }

  const groupedExpenses =
    groupExpensesByDate(expenses);

  [
    ...groupedExpenses.entries()
  ]
    .sort(
      ([leftDate], [rightDate]) =>
        rightDate.localeCompare(leftDate)
    )
    .forEach(
    (
      [dateKey, dayExpenses],
      index
    ) => {
      container.append(
        createHistoryDayGroup(
          dateKey,
          dayExpenses,
          callbacks,
          index === 0
        )
      );
    }
  );
}

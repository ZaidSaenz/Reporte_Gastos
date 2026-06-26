// ============================================================
// COPY DAILY EXPENSE HISTORY
// ============================================================

function generateDailyHistoryText(
  dateKey,
  expenses
) {
  const lines = [
    formatFullDate(dateKey),
    ""
  ];

  expenses.forEach(
    (expense) => {
      lines.push(
        `${getExpenseCategoryLabel(expense)}: ` +
        `${formatCurrency(expense.amount)}`
      );

      if (expense.description) {
        lines.push(
          `  ${expense.description}`
        );
      }
    }
  );

  lines.push(
    "",
    `${t("history.total")}: ` +
    formatCurrency(
      calculateExpenseTotal(expenses)
    )
  );

  return lines.join("\n");
}

function copyTextWithFallback(text) {
  const textarea =
    document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute(
    "readonly",
    ""
  );

  textarea.style.position =
    "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents =
    "none";

  document.body.append(textarea);

  textarea.focus();
  textarea.select();

  textarea.setSelectionRange(
    0,
    textarea.value.length
  );

  const copied =
    document.execCommand("copy");

  textarea.remove();

  if (!copied) {
    throw new Error(
      "The browser rejected the copy operation."
    );
  }
}

async function copyDailyHistory(
  dateKey,
  expenses
) {
  const text =
    generateDailyHistoryText(
      dateKey,
      expenses
    );

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard
        .writeText(text);
    } else {
      copyTextWithFallback(text);
    }

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("history.copied")
      );
    }
  } catch (error) {
    console.error(
      "Unable to copy daily history:",
      error
    );

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("history.copyError"),
        true
      );
    }
  }
}

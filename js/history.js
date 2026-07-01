// ============================================================
// RESUMEN PRINCIPAL E HISTORIAL DE GASTOS
// ============================================================
//
// Este archivo se encarga de:
//
// 1. Calcular el gasto acumulado mostrado en la pantalla principal.
// 2. Mostrar el presupuesto restante.
// 3. Agrupar los gastos por fecha.
// 4. Crear las filas del historial.
// 5. Mostrar los detalles de un gasto.
//
// IMPORTANTE:
//
// El gasto principal ya NO se reinicia automáticamente al cambiar
// de mes.
//
// El total representa todos los gastos guardados desde el último
// reinicio manual realizado por el usuario.
// ============================================================


// ============================================================
// RESUMEN DE LA PANTALLA PRINCIPAL
// ============================================================

function renderHomeSummary(expenses) {
  /*
   * Suma todos los gastos actualmente guardados.
   *
   * Antes se filtraban únicamente los gastos del mes actual.
   * Ahora el ciclo solamente termina cuando el usuario utiliza
   * la opción "Borrar todo".
   */
  const currentSpending =
    calculateExpenseTotal(expenses);

  /*
   * La configuración todavía utiliza la propiedad
   * "monthlyBudget" porque ese es el nombre guardado actualmente.
   *
   * Aunque internamente conserve ese nombre, ahora funciona como
   * presupuesto general del ciclo actual.
   */
  const settings = getSettings();

  const configuredBudget =
    Number(settings.monthlyBudget) || 0;

  /*
   * Elemento donde se muestra el gasto acumulado.
   */
  const spendingElement =
    document.querySelector(
      "#current-spending-value"
    );

  /*
   * Bloque opcional del presupuesto restante.
   */
  const budgetBlock =
    document.querySelector(
      "#remaining-budget-block"
    );

  const budgetValue =
    document.querySelector(
      "#remaining-budget-value"
    );

  /*
   * Actualiza el número grande de "Gasto actual".
   */
  if (spendingElement) {
    spendingElement.textContent =
      formatCurrency(currentSpending);
  }

  /*
   * Si el HTML no contiene los elementos del presupuesto,
   * detenemos solamente esa parte del renderizado.
   */
  if (!budgetBlock || !budgetValue) {
    return;
  }

  /*
   * El presupuesto solo se muestra cuando el usuario configuró
   * una cantidad mayor que cero.
   */
  const hasBudget =
    configuredBudget > 0;

  budgetBlock.classList.toggle(
    "is-hidden",
    !hasBudget
  );

  /*
   * Calcula cuánto queda disponible dentro del ciclo.
   *
   * El resultado puede ser negativo cuando el usuario supera
   * el presupuesto configurado.
   */
  if (hasBudget) {
    const remainingBudget =
      configuredBudget - currentSpending;

    budgetValue.textContent =
      formatCurrency(remainingBudget);
  }
}


// ============================================================
// AGRUPACIÓN DE GASTOS POR FECHA
// ============================================================

function groupExpensesByDate(expenses) {
  /*
   * Convierte la lista completa de gastos en un Map.
   *
   * Ejemplo:
   *
   * Map {
   *   "2026-06-30" => [gasto1, gasto2],
   *   "2026-07-01" => [gasto3]
   * }
   */
  return expenses.reduce(
    (groups, expense) => {
      /*
       * Si todavía no existe un grupo para esa fecha,
       * se crea una lista vacía.
       */
      if (!groups.has(expense.date)) {
        groups.set(expense.date, []);
      }

      /*
       * Agrega el gasto al grupo correspondiente.
       */
      groups
        .get(expense.date)
        .push(expense);

      return groups;
    },
    new Map()
  );
}


// ============================================================
// FILA INDIVIDUAL DEL HISTORIAL
// ============================================================

function createHistoryRow(
  expense,
  onDetails
) {
  /*
   * Contenedor completo de un gasto.
   */
  const row =
    document.createElement("article");

  /*
   * Elementos visibles dentro de la fila.
   */
  const category =
    document.createElement("strong");

  const amount =
    document.createElement("strong");

  const date =
    document.createElement("span");

  const detailsButton =
    document.createElement("button");

  /*
   * Clases utilizadas por el CSS.
   */
  row.className =
    "history-row";

  category.className =
    "history-row__category";

  amount.className =
    "history-row__amount";

  date.className =
    "history-row__date";

  detailsButton.className =
    "history-row__details";

  /*
   * Nombre de la categoría.
   *
   * Esta función también contempla categorías personalizadas.
   */
  category.textContent =
    getExpenseCategoryLabel(expense);

  /*
   * Importe del gasto.
   */
  amount.textContent =
    formatCurrency(expense.amount);

  /*
   * Fecha seleccionada por el usuario y hora en que fue creado
   * el registro.
   */
  date.textContent =
    `${formatCompactDate(expense.date)} · ` +
    formatTime(expense.createdAt);

  /*
   * Botón para abrir la ventana de detalles.
   */
  detailsButton.type = "button";

  detailsButton.textContent =
    t("history.details");

  detailsButton.addEventListener(
    "click",
    () => {
      onDetails(expense.id);
    }
  );

  /*
   * Inserta todos los elementos dentro de la fila.
   */
  row.append(
    category,
    amount,
    date,
    detailsButton
  );

  return row;
}


// ============================================================
// GRUPO DE GASTOS DE UNA FECHA
// ============================================================

function createHistoryDateGroup(
  dateKey,
  expenses,
  callbacks
) {
  /*
   * Contenedor de todos los gastos pertenecientes a una fecha.
   */
  const section =
    document.createElement("section");

  /*
   * Cabecera del grupo.
   */
  const header =
    document.createElement("div");

  const heading =
    document.createElement("h3");

  const actions =
    document.createElement("div");

  /*
   * Total gastado durante esa fecha.
   */
  const total =
    document.createElement("span");

  /*
   * Botón para copiar el resumen diario.
   */
  const copyButton =
    document.createElement("button");

  /*
   * Lista donde se colocarán las filas individuales.
   */
  const list =
    document.createElement("div");

  /*
   * Clases utilizadas por el CSS.
   */
  section.className =
    "history-date-group";

  header.className =
    "history-date-group__header";

  actions.className =
    "history-date-group__actions";

  total.className =
    "history-date-group__total";

  list.className =
    "history-list";

  /*
   * Muestra la fecha completa del grupo.
   */
  heading.textContent =
    formatFullDate(dateKey);

  /*
   * Suma solamente los gastos pertenecientes a esta fecha.
   */
  total.textContent =
    formatCurrency(
      calculateExpenseTotal(expenses)
    );

  /*
   * Configuración del botón para copiar.
   */
  copyButton.type = "button";

  copyButton.className =
    "button button--secondary button--small";

  copyButton.textContent =
    t("history.copy");

  copyButton.addEventListener(
    "click",
    () => {
      callbacks.onCopy(
        dateKey,
        expenses
      );
    }
  );

  /*
   * Crea una fila visual por cada gasto.
   */
  expenses.forEach((expense) => {
    const historyRow =
      createHistoryRow(
        expense,
        callbacks.onDetails
      );

    list.append(historyRow);
  });

  /*
   * Construcción final del grupo.
   */
  actions.append(
    total,
    copyButton
  );

  header.append(
    heading,
    actions
  );

  section.append(
    header,
    list
  );

  return section;
}


// ============================================================
// RENDERIZADO COMPLETO DEL HISTORIAL
// ============================================================

function renderExpenseHistory(
  expenses,
  callbacks
) {
  /*
   * Contenedor principal del historial.
   */
  const container =
    document.querySelector(
      "#expense-history"
    );

  if (!container) {
    return;
  }

  /*
   * Limpia el contenido anterior antes de volver a dibujarlo.
   */
  container.replaceChildren();

  /*
   * Muestra un mensaje cuando todavía no existen gastos.
   */
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

  /*
   * Agrupa todos los gastos usando su fecha como clave.
   */
  const groups =
    groupExpensesByDate(expenses);

  /*
   * Crea una sección visual para cada fecha.
   */
  groups.forEach(
    (groupExpenses, dateKey) => {
      const dateGroup =
        createHistoryDateGroup(
          dateKey,
          groupExpenses,
          callbacks
        );

      container.append(dateGroup);
    }
  );
}


// ============================================================
// DETALLES DE UN GASTO
// ============================================================

function renderExpenseDetails(expense) {
  /*
   * Evita errores cuando el gasto no existe o fue eliminado.
   */
  if (!expense) {
    return;
  }

  /*
   * Elementos de la ventana de detalles.
   */
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

  /*
   * Importe del gasto.
   */
  if (amount) {
    amount.textContent =
      formatCurrency(expense.amount);
  }

  /*
   * Categoría o nombre personalizado.
   */
  if (category) {
    category.textContent =
      getExpenseCategoryLabel(expense);
  }

  /*
   * Fecha seleccionada y hora de creación.
   */
  if (date) {
    date.textContent =
      `${formatFullDate(expense.date)} · ` +
      formatTime(expense.createdAt);
  }

  /*
   * Descripción opcional.
   *
   * Cuando está vacía, se muestra el texto traducido
   * correspondiente a "Sin descripción".
   */
  if (description) {
    description.textContent =
      expense.description ||
      t("history.noDescription");
  }
}
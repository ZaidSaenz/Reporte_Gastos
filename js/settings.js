// ============================================================
// APPLICATION SETTINGS
// ============================================================

const PALETTE_THEME_COLORS = Object.freeze({
  magenta: "#d10082",
  ocean: "#147d92",
  emerald: "#2f7d5c",
  violet: "#7256c9",
  amber: "#bd7417",
  powder: "#7896b2",
  sage: "#718b78",
  warmGray: "#80766c"
});

function applyApplicationSettings(
  settings = getSettings()
) {
  const root =
    document.documentElement;

  root.lang =
    settings.language || "es";

  root.dataset.visualStyle =
    settings.visualStyle || "modern";

  root.dataset.palette =
    settings.palette || "magenta";

  const themeColor =
    PALETTE_THEME_COLORS[
      settings.palette
    ] ||
    PALETTE_THEME_COLORS.magenta;

  document
    .querySelector(
      'meta[name="theme-color"]'
    )
    ?.setAttribute(
      "content",
      themeColor
    );

  const languageSelect =
    document.querySelector(
      "#select-language"
    );

  const styleSelect =
    document.querySelector(
      "#select-visual-style"
    );

  const paletteSelect =
    document.querySelector(
      "#select-palette"
    );

  const currencySelect =
    document.querySelector(
      "#select-currency"
    );

  if (languageSelect) {
    languageSelect.value =
      settings.language;
  }

  if (styleSelect) {
    styleSelect.value =
      settings.visualStyle;
  }

  if (paletteSelect) {
    paletteSelect.value =
      settings.palette;
  }

  if (currencySelect) {
    currencySelect.value =
      settings.currency;
  }

  applyTranslations();

  document.dispatchEvent(
    new CustomEvent(
      "settingschanged",
      {
        detail: settings
      }
    )
  );
}

function openSettingsDialog() {
  const dialog =
    document.querySelector(
      "#settings-dialog"
    );

  if (!dialog) {
    return;
  }

  if (
    typeof dialog.showModal ===
    "function"
  ) {
    dialog.showModal();
  } else {
    dialog.setAttribute(
      "open",
      ""
    );
  }
}

function closeSettingsDialog() {
  const dialog =
    document.querySelector(
      "#settings-dialog"
    );

  if (!dialog) {
    return;
  }

  if (
    typeof dialog.close ===
    "function"
  ) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function updateSetting(
  settingName,
  settingValue
) {
  const nextSettings = {
    ...getSettings(),
    [settingName]: settingValue
  };

  if (!saveSettings(nextSettings)) {
    return false;
  }

  applyApplicationSettings(
    nextSettings
  );

  return true;
}

function downloadBackup() {
  const backup =
    createLocalBackup();

  const blob = new Blob(
    [
      JSON.stringify(
        backup,
        null,
        2
      )
    ],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `expense-tracker-backup-${getLocalDateKey()}.json`;

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  if (
    typeof showAppMessage ===
    "function"
  ) {
    showAppMessage(
      t("settings.backupCreated")
    );
  }
}

async function importBackupFile(file) {
  if (!file) {
    return;
  }

  try {
    const text =
      await file.text();

    const backup =
      JSON.parse(text);

    if (!restoreLocalBackup(backup)) {
      throw new Error(
        "Invalid backup format."
      );
    }

    applyApplicationSettings(
      getSettings()
    );

    if (
      typeof refreshApplication ===
      "function"
    ) {
      refreshApplication();
    }

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("settings.backupRestored")
      );
    }

    closeSettingsDialog();
  } catch (error) {
    console.error(
      "Unable to restore backup:",
      error
    );

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("settings.backupError"),
        true
      );
    }
  }
}

function clearStoredApplicationData() {
  if (
    !window.confirm(
      t("settings.clearConfirm")
    )
  ) {
    return;
  }

  if (!clearApplicationData()) {
    return;
  }

  applyApplicationSettings(
    getSettings()
  );

  if (
    typeof refreshApplication ===
    "function"
  ) {
    refreshApplication();
  }

  if (
    typeof showAppMessage ===
    "function"
  ) {
    showAppMessage(
      t("settings.dataCleared")
    );
  }

  closeSettingsDialog();
}

function initializeSettings() {
  applyApplicationSettings(
    getSettings()
  );

  document
    .querySelector(
      "#open-settings-button"
    )
    ?.addEventListener(
      "click",
      openSettingsDialog
    );

  document
    .querySelector(
      "#close-settings-button"
    )
    ?.addEventListener(
      "click",
      closeSettingsDialog
    );

  document
    .querySelector(
      "#select-language"
    )
    ?.addEventListener(
      "change",
      (event) =>
        updateSetting(
          "language",
          event.target.value
        )
    );

  document
    .querySelector(
      "#select-visual-style"
    )
    ?.addEventListener(
      "change",
      (event) =>
        updateSetting(
          "visualStyle",
          event.target.value
        )
    );

  document
    .querySelector(
      "#select-palette"
    )
    ?.addEventListener(
      "change",
      (event) =>
        updateSetting(
          "palette",
          event.target.value
        )
    );

  document
    .querySelector(
      "#select-currency"
    )
    ?.addEventListener(
      "change",
      (event) =>
        updateSetting(
          "currency",
          event.target.value
        )
    );

  document
    .querySelector(
      "#export-backup-button"
    )
    ?.addEventListener(
      "click",
      downloadBackup
    );

  document
    .querySelector(
      "#import-backup-button"
    )
    ?.addEventListener(
      "click",
      () =>
        document
          .querySelector(
            "#backup-file-input"
          )
          ?.click()
    );

  document
    .querySelector(
      "#backup-file-input"
    )
    ?.addEventListener(
      "change",
      async (event) => {
        const [file] =
          event.target.files;

        await importBackupFile(file);

        event.target.value = "";
      }
    );

  document
    .querySelector(
      "#clear-data-button"
    )
    ?.addEventListener(
      "click",
      clearStoredApplicationData
    );

  document
    .querySelector(
      "#settings-dialog"
    )
    ?.addEventListener(
      "click",
      (event) => {
        if (
          event.target.id ===
          "settings-dialog"
        ) {
          closeSettingsDialog();
        }
      }
    );
}

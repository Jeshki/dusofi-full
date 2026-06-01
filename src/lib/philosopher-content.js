function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.some((item) => isNonEmptyString(item));
}

function pickFirstAvailableContent(philosopher, keys) {
  for (const key of keys) {
    const value = philosopher?.[key];
    if (isNonEmptyString(value) || isNonEmptyStringArray(value)) {
      return value;
    }
  }

  return undefined;
}

export function getPhilosopherLocalizedContent(philosopher, locale, key) {
  if (!philosopher) {
    return undefined;
  }

  if (key === "biography") {
    return pickFirstAvailableContent(philosopher, [
      `biography_${locale}`,
      `bio_${locale}`,
      `about_${locale}`,
      "biography",
      "bio",
      "about",
    ]);
  }

  return pickFirstAvailableContent(philosopher, [`${key}_${locale}`, key]);
}

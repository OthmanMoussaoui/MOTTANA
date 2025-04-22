// import "server-only"

const dictionaries = {
  // The dynamic import itself returns a Promise resolving to the module object
  en: () => import("./dictionaries/en.json"),
  ar: () => import("./dictionaries/ar.json"),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  const loadDictionaryModule = dictionaries[locale]; // Get the function

  if (typeof loadDictionaryModule !== 'function') {
      console.error(`Dictionary loader function for locale "${locale}" is not found.`);
      // Fallback or throw
      // For simplicity, let's assume 'en' always exists and fallback
      const enModuleLoader = dictionaries.en;
      if (!enModuleLoader) throw new Error("Default dictionary 'en' loader not found.");
      const fallbackModule = await enModuleLoader();
      // JSON modules usually have the content as the default export OR the object itself
      return fallbackModule.default || fallbackModule;
  }

  const dictionaryModule = await loadDictionaryModule(); // Call the function, await the promise
  // Check if the resolved module has a 'default' property (common pattern)
  // or return the module itself if it's directly the JSON content.
  return dictionaryModule.default || dictionaryModule;
};

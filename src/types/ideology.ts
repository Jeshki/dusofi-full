import type { StaticImageData } from "next/image";

/**
 * Loose model for ideology records in `ideologiesData.js`.
 *
 * Most text fields support locale-specific variants using the suffix pattern:
 * - `<baseKey>_lt`, `<baseKey>_de`, `<baseKey>_fr`, `<baseKey>_es`, `<baseKey>_it`
 * For example: `name_lt`, `description_de`, `title_fr`, `content_es`, etc.
 */
export type IdeologySubSection = {
  title?: string;
  title_lt?: string;
  title_de?: string;
  title_fr?: string;
  title_es?: string;
  title_it?: string;
  content?: string;
  content_lt?: string;
  content_de?: string;
  content_fr?: string;
  content_es?: string;
  content_it?: string;
  [key: string]: unknown;
};

export type Ideology = {
  id: string;
  name?: string;
  name_lt?: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name_it?: string;
  description?: string;
  description_lt?: string;
  description_de?: string;
  description_fr?: string;
  description_es?: string;
  description_it?: string;
  image?: string | StaticImageData;
  subSections?: IdeologySubSection[];
  [key: string]: unknown;
};

import type { StaticImageData } from "next/image";

/**
 * Loose model for philosopher records in `data.js`.
 *
 * Many text fields support locale-specific variants using the suffix pattern:
 * - `<baseKey>_lt`, `<baseKey>_de`, `<baseKey>_fr`, `<baseKey>_es`, `<baseKey>_it`
 * For example: `quote_lt`, `biography_de`, `shortStory_fr`, `quotes_es`, etc.
 */
export type Philosopher = {
  id: number;
  name: string;
  years?: string;
  img: string | StaticImageData;
  biography?: string;
  shortStory?: string;
  quotes?: string[];
  IdeologicalOrder?: string;
  geographicalOrder?: string;
  ChronologicalOrder?: string;
  quote?: string;
  startYear?: number;
  endYear?: number;
  [key: string]: unknown;
};

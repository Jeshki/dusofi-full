import type { Ideology } from "@/types/ideology";
import { ideologies as ideologiesUntyped } from "@/ideologiesData.js";

export const ideologies = ideologiesUntyped as Ideology[];

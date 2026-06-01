import type { Philosopher } from "@/types/philosopher";
import { philosophers as philosophersUntyped } from "@/data.js";

export const philosophers = philosophersUntyped as Philosopher[];

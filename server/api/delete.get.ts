import { defineEventHandler, getQuery } from "h3";
import { del } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
    const { col, id } = getQuery(event);
    await del(col as string, id as string);
    return { result: id };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
});

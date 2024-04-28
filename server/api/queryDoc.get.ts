import { defineEventHandler, getQuery } from "h3";
import { queryById } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const doc = await queryById(query.col as string, query.id as string);
    return { result: doc };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
});

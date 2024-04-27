import { defineEventHandler, getQuery } from "h3";
import { queryByCollection } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const docs = await queryByCollection(query.col as string);
    return { result: docs };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
});

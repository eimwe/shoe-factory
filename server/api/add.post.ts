import { defineEventHandler, getQuery, readBody } from "h3";
import { add } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const body = await readBody(event);
    const docRef = await add(query.col as string, body);
    return { result: docRef };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
});

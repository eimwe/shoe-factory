import { Account, Client, Databases, Storage } from "appwrite";
import { APPWRITE_API_URL, APPWRITE_API_KEY } from "@/utils/app.constants";

export const client = new Client();

client.setEndpoint(APPWRITE_API_URL).setProject(APPWRITE_API_KEY);

export { ID } from "appwrite";
export const account = new Account(client);
export const db = new Databases(client);
export const storage = new Storage(client);

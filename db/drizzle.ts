import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.POSTGRES_URL as string);
const db = drizzle(client, {
	schema,
});

export default db;

import dbConnectionString from "./db_utils";
import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool(dbConnectionString);

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const res = await pool.query("SELECT NOW()");

    console.log("Database succesfully connected");
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying to connect in ${delay}ms...`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    }
    console.error("Database failed to connect", error);
  }
};

const queryDB = async <T extends QueryResultRow>(
  queryText: string,
  values: any[]
): Promise<QueryResult<T>> => {
  try {
    const response: QueryResult<T> = await pool.query<T>(queryText, values);
    return response;
  } catch (error: any) {
    console.error("Error executing query", {
      queryText,
      values,
      errorMessage: error.message,
    });
    throw new Error(error.message);
  }
};

export { connectDB, queryDB };

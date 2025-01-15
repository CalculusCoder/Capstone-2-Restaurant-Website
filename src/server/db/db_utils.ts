require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const isProduction = process.env.NODE_ENV === "production";

const dbConnectionString = isProduction
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      database: process.env.DB_NAME,
    };

export default dbConnectionString;

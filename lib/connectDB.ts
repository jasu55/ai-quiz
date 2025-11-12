// src/lib/connectDB.ts
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ... бусад тохиргоо
});

export async function query(text: string, params: any[] = []) {
  const res = await pool.query(text, params);
  console.log({ text, params, rowCount: res.rowCount });
  return res;
}

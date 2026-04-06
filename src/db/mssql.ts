// MSSQL database interactions
import sql from "mssql";
import dotenv from "dotenv";
// import { FileRecord } from "../types/index.ts";
interface FileRecord {
  id: number;
  filePath: string;
}

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  server: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT || "1433"),
  database: process.env.DB_NAME!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function getPendingFiles(): Promise<FileRecord[]> {
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT id, filePath
    FROM [File]
    WHERE status IN ('PENDING', 'FAILED');
  `);
  return result.recordset;
}

export async function markFileDone(id: number) {
  const pool = await sql.connect(config);
  await pool
    .request()
    .input("id", sql.Int, id)
    .query(`UPDATE [File] SET status = 'DONE' WHERE id = @id`);
}

export async function markFileFailed(id: number) {
  const pool = await sql.connect(config);
  await pool
    .request()
    .input("id", sql.Int, id)
    .query(`UPDATE [File] SET status = 'FAILED' WHERE id = @id`);
}

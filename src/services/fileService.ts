// File processing + parallel handling

import pLimit from "p-limit";
import { getPendingFiles, markFileDone, markFileFailed } from "../db/mssql.ts";
import { transferFile } from "./transferService.ts";

const concurrency = parseInt(process.env.CONCURRENCY_LIMIT || "5");

export async function processFiles() {
  console.log("Fetching pending files...");
  const files = await getPendingFiles();
  console.log(`Found ${files.length} pending files`);
  files.forEach((file) => {
    console.log(`Found ${file.filePath} `);
  });
  if (files.length === 0) {
    console.log("No pending files");
    return;
  }

  const limit = pLimit(concurrency);

  const promises = files.map((file) =>
    limit(async () => {
      try {
        await transferFile(file.filePath);
        await markFileDone(file.id);
        console.log(`✅ Done: ${file.filePath}`);
      } catch (err) {
        console.error(`❌ Failed: ${file.filePath}`, err);
        await markFileFailed(file.id);
      }
    }),
  );

  await Promise.all(promises);
  console.log("All files processed");
}

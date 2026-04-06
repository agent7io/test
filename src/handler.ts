// Lambda entry point

import { processFiles } from "./services/fileService.ts";

export const handler = async () => {
  try {
    console.log("Starting file processing...");
    await processFiles();
    console.log("File processing completed.");
    return { statusCode: 200, body: "Files processed successfully" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error processing files" };
  }
};

// Call the handler when running the script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  handler().catch(console.error);
}

import Client from "ssh2-sftp-client";
import os from "os";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export async function downloadToDownloads(remoteFilePath: string) {
  const sftp = new Client();

  try {
    console.log("Connecting to SOURCE SFTP...");
    await sftp.connect({
      host: process.env.SOURCE_SFTP_HOST!,
      port: parseInt(process.env.SOURCE_SFTP_PORT || "22"),
      username: process.env.SOURCE_SFTP_USER!,
      password: process.env.SOURCE_SFTP_PASS!,
    });

    const fileName = path.basename(remoteFilePath);

    const localPath = path.join(os.homedir(), "Downloads", fileName);

    console.log(`Downloading to: ${localPath}`);

    await sftp.fastGet(remoteFilePath, localPath);

    console.log("✅ File downloaded successfully to Downloads");
  } catch (err) {
    console.error("❌  Error:", err);
    throw err;
  } finally {
    await sftp.end().catch(() => {});
  }
}

downloadToDownloads("\\172.16.4.2\Public\Common\CKYCTESTING\ERF.pdf");

//  npx tsx .\src\services\transferService.ts

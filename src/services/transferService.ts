import Client from "ssh2-sftp-client";
import dotenv from "dotenv";
import os from "os";
import path from "path";

dotenv.config();

export async function transferFile(remoteFilePath: string) {
  const sourceSftp = new Client();
  const destSftp = new Client();

  try {
    // -------------------------------
    // 1. Connect to SOURCE SFTP
    // -------------------------------
    console.log("Connecting to SOURCE SFTP...");
    await sourceSftp.connect({
      host: process.env.SOURCE_SFTP_HOST!,
      port: parseInt(process.env.SOURCE_SFTP_PORT || "22"),
      username: process.env.SOURCE_SFTP_USER!,
      password: process.env.SOURCE_SFTP_PASS!,
    });
    console.log("Connected to SOURCE SFTP");

    // -------------------------------
    // 2. Connect to DESTINATION SFTP
    // -------------------------------
    console.log("Connecting to DESTINATION SFTP...");
    await destSftp.connect({
      host: process.env.DEST_SFTP_HOST!,
      port: parseInt(process.env.DEST_SFTP_PORT || "22"),
      username: process.env.DEST_SFTP_USER!,
      password: process.env.DEST_SFTP_PASS!,
    });
    console.log("Connected to DESTINATION SFTP");

    // -------------------------------
    // 3. Extract filename
    // -------------------------------
    const fileName = path.basename(remoteFilePath);
    if (!fileName) {
      throw new Error(`Invalid remote file path: ${remoteFilePath}`);
    }

    // -------------------------------
    // 4. Local Downloads path
    // -------------------------------
    const localPath = path.join(os.homedir(), "Downloads", fileName);

    console.log(`Downloading file from SOURCE: ${remoteFilePath}`);
    console.log(`Saving to local path: ${localPath}`);

    // -------------------------------
    // 5. Download from SOURCE
    // -------------------------------
    await sourceSftp.fastGet(remoteFilePath, localPath);
    console.log("Download successful");

    // -------------------------------
    // 6. Upload to DESTINATION
    // -------------------------------
    const destinationPath = `/destination/${fileName}`;

    console.log(`Uploading file to DESTINATION: ${destinationPath}`);

    await destSftp.fastPut(localPath, destinationPath);
    console.log("Upload successful");
  } catch (error) {
    console.error("File transfer failed:", error);
    throw error;
  } finally {
    // -------------------------------
    // 7. Close connections safely
    // -------------------------------
    await sourceSftp.end().catch(() => {});
    await destSftp.end().catch(() => {});
    console.log("SFTP connections closed");
  }
}

// -------------------------------
// Example usage
// -------------------------------
transferFile("\\172.16.4.2\Public\Common\CKYCTESTING\ERF.pdf");

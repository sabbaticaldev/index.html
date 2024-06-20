import { execSync } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";

function generateCertificates(baseDir) {
  const idxDir = path.join(baseDir, ".idx");

  if (!fs.existsSync(idxDir)) {
    fs.mkdirSync(idxDir);
  }

  const keyPath = path.join(idxDir, "key.pem");
  const certPath = path.join(idxDir, "cert.pem");

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log("Generating SSL certificates...");
    try {
      execSync(`openssl genrsa -out ${keyPath} 2048`, { stdio: "inherit" });
      execSync(
        `openssl req -new -key ${keyPath} -out ${path.join(
          idxDir,
          "csr.pem",
        )} -subj "/CN=localhost"`,
        { stdio: "inherit" },
      );
      execSync(
        `openssl x509 -req -days 365 -in ${path.join(
          idxDir,
          "csr.pem",
        )} -signkey ${keyPath} -out ${certPath}`,
        { stdio: "inherit" },
      );
      fs.unlinkSync(path.join(idxDir, "csr.pem")); // Remove the CSR file as it is no longer needed
      console.log("SSL certificates generated.");
    } catch (error) {
      console.error("Error generating SSL certificates:", error);
    }
  } else {
    console.log("SSL certificates already exist.");
  }

  return { keyPath, certPath };
}

export function createHttpsServer(rootDir, requestHandler) {
  const { keyPath, certPath } = generateCertificates(rootDir);

  console.log(`Using SSL key at: ${keyPath}`);
  console.log(`Using SSL certificate at: ${certPath}`);

  const serverOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  return https.createServer(serverOptions, requestHandler);
}

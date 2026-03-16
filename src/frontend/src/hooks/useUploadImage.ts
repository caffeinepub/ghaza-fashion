import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

function withTimeout<T>(promise: Promise<T>, ms = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Upload timed out. Check your connection and try again."),
          ),
        ms,
      ),
    ),
  ]);
}

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setUploading(true);
    try {
      const config = await withTimeout(loadConfig(), 10000);

      if (
        !config.storage_gateway_url ||
        config.storage_gateway_url === "nogateway"
      ) {
        throw new Error(
          "Image storage is not configured. Please contact support.",
        );
      }

      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const urls: string[] = [];
      for (const file of Array.from(files)) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `File "${file.name}" is too large. Maximum size is 5MB.`,
          );
        }
        const bytes = new Uint8Array(
          await withTimeout(file.arrayBuffer(), 10000),
        );
        const { hash } = await withTimeout(storageClient.putFile(bytes), 30000);
        const url = await withTimeout(storageClient.getDirectURL(hash), 10000);
        urls.push(url);
      }
      return urls;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
}

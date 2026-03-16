import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setUploading(true);
    try {
      let config: Awaited<ReturnType<typeof loadConfig>>;
      try {
        config = await loadConfig();
      } catch {
        throw new Error(
          "Cannot connect to server. Check your internet and try again.",
        );
      }

      if (
        !config.storage_gateway_url ||
        config.storage_gateway_url === "nogateway"
      ) {
        throw new Error(
          "Photo storage is not available. Please try again later.",
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
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`"${file.name}" is too large. Max size is 5MB.`);
        }
        let bytes: Uint8Array;
        try {
          bytes = new Uint8Array(await file.arrayBuffer());
        } catch {
          throw new Error("Could not read the photo file. Please try again.");
        }
        let hash: string;
        try {
          const result = await storageClient.putFile(bytes);
          hash = result.hash;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`Photo upload failed: ${msg.slice(0, 120)}`);
        }
        let url: string;
        try {
          url = await storageClient.getDirectURL(hash);
        } catch {
          throw new Error(
            "Photo uploaded but URL could not be retrieved. Try again.",
          );
        }
        urls.push(url);
      }
      return urls;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
}

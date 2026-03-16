import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: FileList): Promise<string[]> => {
    setUploading(true);
    try {
      const config = await loadConfig();
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
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes);
        const url = await storageClient.getDirectURL(hash);
        urls.push(url);
      }
      return urls;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
}

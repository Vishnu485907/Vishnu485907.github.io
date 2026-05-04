import { useCallback, useState } from "react";
import { openCredfixDownload } from "@/lib/credfix";

export function useCredfixDownload() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownloadClick = useCallback(() => {
    const device = openCredfixDownload();
    if (device === "unknown") {
      setShowDownloadModal(true);
    }
  }, []);

  return {
    handleDownloadClick,
    showDownloadModal,
    setShowDownloadModal,
  };
}

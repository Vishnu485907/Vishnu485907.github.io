import {
  CREDIFIX_APP_STORE_URL,
  CREDIFIX_PLAY_STORE_URL,
} from "@/lib/credfix";

type CredfixDownloadModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CredfixDownloadModal({
  open,
  onClose,
}: CredfixDownloadModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8">
        <h3 className="text-xl font-semibold text-pitch-black mb-2">
          Download Credfix
        </h3>
        <p className="text-sm text-neutral-600 mb-6">
          Get your personalized financial plan on the go.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={CREDIFIX_PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-pitch-black text-white rounded-full py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Download on Play Store
          </a>
          <a
            href={CREDIFIX_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-neutral-100 text-pitch-black rounded-full py-3 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Download on App Store
          </a>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-neutral-500 hover:text-neutral-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

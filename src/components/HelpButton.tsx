import { useState, useMemo } from "react";
import { HelpCircle, X, Smartphone, ExternalLink } from "lucide-react";

type DeviceType = "android" | "ios" | "unknown";

function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "unknown";
}

export default function HelpButton() {
  const [showModal, setShowModal] = useState(false);
  const device = useMemo(() => detectDevice(), []);

  const handleClick = () => {
    if (device === "android") {
      window.open(
        "https://play.google.com/store/apps/details?id=com.credfix",
        "_blank"
      );
    } else if (device === "ios") {
      window.open(
        "https://apps.apple.com/bh/app/credfix/id6760899516",
        "_blank"
      );
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-8 left-8 z-40 bg-pitch-black text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 group"
        title="Get Help"
      >
        <HelpCircle size={20} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 text-sm font-medium whitespace-nowrap">
          Get Help
        </span>
      </button>

      {/* Modal for Unknown Devices */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <Smartphone size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pitch-black">
                    Get Credfix App
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Download for your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.credfix"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-pitch-black text-white rounded-2xl px-5 py-3.5 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-400">Get it on</p>
                    <p className="text-sm font-medium">Google Play</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-neutral-400" />
              </a>

              <a
                href="https://apps.apple.com/bh/app/credfix/id6760899516"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-neutral-100 text-pitch-black rounded-2xl px-5 py-3.5 hover:bg-neutral-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-500">
                      Download on the
                    </p>
                    <p className="text-sm font-medium">App Store</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-neutral-400" />
              </a>
            </div>

            <p className="text-[11px] text-neutral-400 mt-4 text-center">
              Get personalized financial planning on the go.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

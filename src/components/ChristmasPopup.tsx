import { useEffect } from "react";
import WhatsAppChannelBanner from "./WhatsAppChannelBanner";

interface Props {
  onClose: () => void;
}

const ChristmasPopup = ({ onClose }: Props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-[92%] max-w-md
          animate-[scaleIn_0.25s_ease-out]
          rounded-2xl bg-white
          p-4 sm:p-5
          shadow-2xl
        "
      >

        <img
          src="/christmaswish.jpg"
          alt="Merry Christmas"
          className="w-full rounded-xl object-cover"
        />

        <div className="my-4 h-px bg-gray-200" />

        <WhatsAppChannelBanner />

        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="
              w-full rounded-xl
              border border-gray-300
              bg-gray-50 py-2.5
              text-sm font-medium text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            Close & Continue to Site
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChristmasPopup;

import { useEffect } from "preact/hooks";

export interface LightboxItem {
  src: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  items,
  index,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  if (index === null) return null;

  const item = items[index];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [index]);

  return (
    <div class="lightbox visible">
      <div class="lightbox-backdrop" onClick={onClose} />

      <div class="lightbox-content">
        <button class="close" onClick={onClose}>
          &times;
        </button>

        <button class="nav left" onClick={onPrev}>
          &#10094;
        </button>
        <button class="nav right" onClick={onNext}>
          &#10095;
        </button>

        <div class="lightbox-image-wrapper">
          <img key={item.src} src={item.src} class="lightbox-img show" />
        </div>

        <div class="lightbox-meta">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>

      <style>
        {`
        body {
          overflow: hidden;
        }
        
        .lightbox {
          position: fixed;
          overflow-y: scroll;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.85);
          animation: fadeIn 0.3s ease;
        }

        .lightbox-backdrop {
          position: absolute;
          inset: 0;
        }

        .lightbox-content {
          position: relative;
          width: 90%;
          max-width: 900px;
          margin: 5% auto;
          text-align: center;
          color: white;
        }

        .lightbox-img {
          width: 100%;
          max-height: 80vh;
          object-fit: contain;
          opacity: 0;
          animation: fadeImage 0.4s ease forwards;
        }

        @keyframes fadeImage {
          to { opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .close {
          position: absolute;
          top: -40px;
          right: 0;
          font-size: 2rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .nav.left { left: -50px; }
        .nav.right { right: -50px; }

        .lightbox-meta {
          margin-top: 1rem;
        }
        `}
      </style>
    </div>
  );
}
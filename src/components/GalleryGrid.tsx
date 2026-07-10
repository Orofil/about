import { useEffect, useRef, useState } from "preact/hooks";
import Lightbox, { type LightboxItem } from "./Lightbox";

interface Props {
  items: LightboxItem[];
  columns?: number;
}

export default function GalleryGrid({
  items,
  columns = 4,
}: Props) {
  const [layout, setLayout] = useState<LightboxItem[][]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Masonry layout
  async function buildLayout(): Promise<void> {
    const cols: LightboxItem[][] = Array.from(
      { length: columns },
      () => []
    );

    const heights = new Array(columns).fill(0);

    // Calculate image heights
    const imageHeights = await Promise.all(
      items.map((item) => {
        return new Promise<number>((resolve) => {
          const img = new Image();
          img.src = item.src;
          img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const height = 1 / aspectRatio; // Approximate height
            resolve(height);
          };
          img.onerror = () => resolve(1);
        });
      })
    );

    items.forEach((item, index) => {
      const shortest = heights.indexOf(Math.min(...heights));
      const longest = heights.indexOf(Math.max(...heights));
      const heightDifference = heights[longest] - heights[shortest];

      if (imageHeights[index] < 2 * heightDifference) {
        // Add to the shortest column if the condition is met
        cols[shortest].push({ ...item, _index: index } as LightboxItem);
        heights[shortest] += imageHeights[index];
      } else {
        // Add to the column in left-to-right flow
        const targetColumn = index % columns;
        cols[targetColumn].push({ ...item, _index: index } as LightboxItem);
        heights[targetColumn] += imageHeights[index];
      }
    });

    setLayout(cols);
  }

  useEffect(() => {
    buildLayout();
  }, [items, columns]);

  useEffect(() => {
    const onResize = () => buildLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items, columns]);

  function open(index: number) {
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
  }

  function next() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % items.length);
  }

  function prev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  }

  return (
    <>
      <div class="gallery-grid" ref={containerRef}>
        {layout.map((col, i) => (
          <div class="gallery-column" key={i}>
            {col.map((item: any) => (
              <div
                class="gallery-item"
                onClick={() => open(item._index)}
              >
                <img src={item.src} alt={item.description} loading="lazy" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Lightbox
        items={items}
        index={activeIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />

      <style>
        {`
        .gallery-grid {
          display: flex;
          gap: 1rem;
          margin: 0 1rem;
        }

        .gallery-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .gallery-item img {
          width: 100%;
          border-radius: 6px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </>
  );
}
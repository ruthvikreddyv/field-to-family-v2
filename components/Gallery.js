import { useEffect, useRef, useState } from "react";
import { FieldScene, StoreScene, DeliveryScene } from "./Scenes";

const SCENES = { field: FieldScene, store: StoreScene, delivery: DeliveryScene };

// Shows your real photo if the file exists, otherwise the matching drawing.
function Photo({ src, scene, alt }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const Scene = SCENES[scene] || FieldScene;
  if (failed) return <Scene />;
  return <img ref={ref} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="scene" />;
}

export default function Gallery({ items }) {
  return (
    <section className="gallery" aria-label="Our farm and store">
      <h2>Our farm &amp; store</h2>
      <div className="g-grid">
        {items.map((g) => (
          <figure className="g-card" key={g.title}>
            <div className="g-img"><Photo src={g.photo} scene={g.scene} alt={g.title} /></div>
            <figcaption><b>{g.title}</b><span>{g.text}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

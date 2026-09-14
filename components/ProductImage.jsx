"use client";
import { useState } from "react";
import { T } from "../lib/products";

const Icon = ({ name, color = T.ice, size = 34 }) => {
  const common = { width: size, height: size, viewBox: "0 0 48 48", fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "track":
      return (
        <svg {...common}>
          <rect x="6" y="16" width="36" height="16" rx="8" />
          <circle cx="14" cy="24" r="2.2" fill={color} stroke="none" />
          <circle cx="24" cy="24" r="2.2" fill={color} stroke="none" />
          <circle cx="34" cy="24" r="2.2" fill={color} stroke="none" />
        </svg>
      );
    case "belt":
      return (
        <svg {...common}>
          <circle cx="16" cy="24" r="8" />
          <circle cx="34" cy="16" r="5" />
          <path d="M20 18 L30 12 M20 30 L30 20" />
        </svg>
      );
    case "ski":
      return (
        <svg {...common}>
          <path d="M8 32 Q10 14 20 12 L38 12 Q40 12 40 16 L40 30 Q40 32 38 32 Z" />
          <path d="M14 32 L14 38 M32 32 L32 38" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M24 6 L24 20 M17 13 L24 20 L31 13" />
          <rect x="14" y="20" width="20" height="18" rx="2" />
          <path d="M18 26 L30 26 M18 31 L30 31" />
        </svg>
      );
    case "helmet":
      return (
        <svg {...common}>
          <path d="M8 30 Q8 10 24 10 Q40 10 40 30 L40 32 L8 32 Z" />
          <path d="M8 30 L4 30 M40 30 L44 30" />
          <path d="M16 32 Q16 24 24 24 Q32 24 32 32" />
        </svg>
      );
    case "jacket":
      return (
        <svg {...common}>
          <path d="M16 8 L12 12 L12 38 L36 38 L36 12 L32 8 L24 12 Z" />
          <path d="M24 12 L24 38 M12 18 L6 22 L6 30 M36 18 L42 22 L42 30" />
        </svg>
      );
    case "glove":
      return (
        <svg {...common}>
          <path d="M18 40 L18 20 Q18 16 21 16 Q24 16 24 20 L24 12 Q24 9 27 9 Q30 9 30 12 L30 20 Q30 16 33 16 Q36 16 36 20 L36 32 Q36 40 28 40 Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M24 6 L38 12 L38 22 Q38 34 24 42 Q10 34 10 22 L10 12 Z" />
          <path d="M18 24 L22 28 L30 18" />
        </svg>
      );
    case "boot":
      return (
        <svg {...common}>
          <path d="M18 8 L18 26 L10 30 Q6 32 6 36 L6 38 L38 38 L38 32 Q38 28 33 26 L26 22 L26 8 Z" />
          <path d="M18 14 L26 14 M18 19 L26 19" />
        </svg>
      );
    case "cog":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="7" />
          <path d="M24 10 L24 15 M24 33 L24 38 M10 24 L15 24 M33 24 L38 24 M14 14 L17.5 17.5 M30.5 30.5 L34 34 M34 14 L30.5 17.5 M17.5 30.5 L14 34" />
        </svg>
      );
    default:
      return null;
  }
};

const PhotoPlaceholder = ({ icon, color }) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      backgroundImage: `repeating-linear-gradient(90deg, ${T.panel2} 0 40px, ${T.panel} 40px 80px)`,
      backgroundSize: "120px 100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon name={icon} color={color} size={36} />
  </div>
);

/* ============ Product image with fallback if the source fails to load ============ */
/* object-fit: contain + white background — вся фотография видна целиком, без обрезки; если пропорции не совпадают, по бокам/сверху добавляются белые поля */
const ProductImage = ({ src, alt, icon, color, zoom }) => {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <PhotoPlaceholder icon={icon} color={color} />;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className={zoom ? "st-card-img" : undefined}
      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#FFFFFF" }}
    />
  );
};

export { Icon, PhotoPlaceholder, ProductImage };

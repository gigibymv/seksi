import hatBlackRed from "@/assets/hat-black-red.png";
import hatVertBleu from "@/assets/hat-vert-bleu.png";
import hatYellowPink from "@/assets/hat-yellow-pink.png";
import hatJeanBrown from "@/assets/hat-jean-brown.png";
import tshirtBlackFront from "@/assets/tshirt_black_front_new.png";
import tshirtBlackBack from "@/assets/tshirt_black_back.png";
import tshirtWhiteFront from "@/assets/tshirt_white_front.png";
import tshirtWhiteBack from "@/assets/tshirt_white_back.png";
import jacketProduct from "@/assets/jacket-product.png";
import jacketStyled from "@/assets/jacket-styled.png";
import vestProduct from "@/assets/vest-product.png";
import vestStyled from "@/assets/vest-styled.png";

export type Category = "cap" | "tshirt" | "jacket" | "hoodie";

export interface ProductVariant {
  id: string;
  label: string;
  color?: string;
  image: string;
  secondaryImage?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  secondaryImage?: string;
  description: string;
  soldOut?: boolean;
  comingSoon?: boolean;
  variants?: ProductVariant[];
  sizes?: string[];
  unavailableSizes?: string[];
}

export const products: Product[] = [
  // ── Hats ────────────────────────────────────────
  {
    id: "nine-cap-black-red",
    name: 'The Nine Cap — "Noire" & "Rouge"',
    price: 30,
    category: "cap",
    image: hatBlackRed,
    description: "100% Cotton",
    variants: [
      { id: "cap-black", label: "Black", color: "#1a1a1a", image: hatBlackRed },
      { id: "cap-red", label: "Red", color: "#e31b23", image: hatBlackRed },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-green-blue",
    name: 'The Nine Cap — "Verte" & "Bleue"',
    price: 30,
    category: "cap",
    image: hatVertBleu,
    description: "100% Cotton",
    variants: [
      { id: "cap-green", label: "Green", color: "#1e7a3c", image: hatVertBleu },
      { id: "cap-blue", label: "Blue", color: "#2c5fa8", image: hatVertBleu },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-yellow-pink",
    name: 'The Nine Cap — "Jaune" & "Rose"',
    price: 30,
    category: "cap",
    image: hatYellowPink,
    description: "100% Cotton",
    variants: [
      { id: "cap-yellow", label: "Yellow", color: "#e6c84c", image: hatYellowPink },
      { id: "cap-pink", label: "Pink", color: "#d4829e", image: hatYellowPink },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-jean-brown",
    name: 'The Nine Cap — "Jean" & "Marron"',
    price: 30,
    category: "cap",
    image: hatJeanBrown,
    description: "100% Cotton",
    variants: [
      { id: "cap-jean", label: "Jean", color: "#6b88a8", image: hatJeanBrown },
      { id: "cap-brown", label: "Brown", color: "#7a4e2d", image: hatJeanBrown },
    ],
    sizes: ["One Size"],
  },

  // ── T-Shirts ────────────────────────────────────
  {
    id: "c27-tshirt-black",
    name: 'The Nine T-shirt - "Noir"',
    price: 30,
    category: "tshirt",
    image: tshirtBlackFront,
    secondaryImage: tshirtBlackBack,
    description: "100% Cotton",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "c27-tshirt-white",
    name: 'The Nine T-shirt - "Blanc"',
    price: 30,
    category: "tshirt",
    image: tshirtWhiteFront,
    secondaryImage: tshirtWhiteBack,
    description: "100% Cotton",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },

  // ── Jackets (Coming Soon) ───────────────────────
  {
    id: "27th-ivy-jacket",
    name: "The 27th Ivy Ja(c)ket",
    price: 120,
    category: "jacket",
    image: jacketProduct,
    secondaryImage: jacketStyled,
    description: "Denim zip jacket with embroidered C₂₇ monogram — Aldrich Nine collection",
    comingSoon: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "27th-sleeveless-jacket",
    name: "The 27th Sleeveless Ja(c)ket",
    price: 95,
    category: "jacket",
    image: vestProduct,
    secondaryImage: vestStyled,
    description: "Quilted denim vest with tie-front closure and C₂₇ embroidery",
    comingSoon: true,
    sizes: ["S", "M", "L", "XL"],
  },
];

export const categories: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cap", label: "Caps" },
  { value: "tshirt", label: "T-Shirts" },
  { value: "jacket", label: "Jackets" },
];

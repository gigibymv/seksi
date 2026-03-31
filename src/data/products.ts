import hatBlackRed from "@/assets/hat-black-red.png";
import hatGreenBlue from "@/assets/hat-green-blue.png";
import hatYellowPink from "@/assets/hat-yellow-pink.png";
import hatJeanBrown from "@/assets/hat-jean-brown.png";
import jacketProduct from "@/assets/jacket-product.png";
import jacketStyled from "@/assets/jacket-styled.png";
import vestProduct from "@/assets/vest-product.png";
import vestStyled from "@/assets/vest-styled.png";

export type Category = "cap" | "tshirt" | "jacket" | "hoodie";

export interface ProductVariant {
  id: string;
  label: string;
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
    price: 35,
    category: "cap",
    image: hatBlackRed,
    description: "Dad cap with embroidered Aldrich Nine script — C '27 Edition",
    variants: [
      { id: "cap-black", label: "Black", image: hatBlackRed },
      { id: "cap-red", label: "Red", image: hatBlackRed },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-green-blue",
    name: 'The Nine Cap — "Verte" & "Bleue"',
    price: 35,
    category: "cap",
    image: hatGreenBlue,
    description: "Dad cap with embroidered Aldrich Nine script — C '27 Edition",
    variants: [
      { id: "cap-green", label: "Green", image: hatGreenBlue },
      { id: "cap-blue", label: "Blue", image: hatGreenBlue },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-yellow-pink",
    name: 'The Nine Cap — "Jaune" & "Rose"',
    price: 35,
    category: "cap",
    image: hatYellowPink,
    description: "Dad cap with embroidered Aldrich Nine script — C '27 Edition",
    variants: [
      { id: "cap-yellow", label: "Yellow", image: hatYellowPink },
      { id: "cap-pink", label: "Pink", image: hatYellowPink },
    ],
    sizes: ["One Size"],
  },
  {
    id: "nine-cap-jean-brown",
    name: 'The Nine Cap — "Jean" & "Marron"',
    price: 35,
    category: "cap",
    image: hatJeanBrown,
    description: "Dad cap with embroidered Aldrich Nine script — C '27 Edition",
    variants: [
      { id: "cap-jean", label: "Jean", image: hatJeanBrown },
      { id: "cap-brown", label: "Brown", image: hatJeanBrown },
    ],
    sizes: ["One Size"],
  },

  // ── T-Shirts ────────────────────────────────────
  {
    id: "c27-tshirt-black",
    name: "The C₂₇ Tee — Black",
    price: 40,
    category: "tshirt",
    image: "/placeholder.svg",
    description: "Section C classic tee — Black edition",
    comingSoon: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "c27-tshirt-white",
    name: "The C₂₇ Tee — White",
    price: 40,
    category: "tshirt",
    image: "/placeholder.svg",
    description: "Section C classic tee — White edition",
    comingSoon: true,
    sizes: ["S", "M", "L", "XL"],
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

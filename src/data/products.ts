import capProduct from "@/assets/cap-product.png";
import capStyled from "@/assets/cap-styled.png";
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
  variants?: ProductVariant[];
  sizes?: string[];
  unavailableSizes?: string[];
}

export const products: Product[] = [
  {
    id: "the-9th-cap",
    name: "The 9th (C)ap",
    price: 35,
    category: "cap",
    image: capProduct,
    secondaryImage: capStyled,
    description: "Washed denim dad cap with embroidered Aldrich Nine script — C '27 Edition",
    variants: [
      { id: "cap-blue", label: "Blue Denim", image: capProduct, secondaryImage: capStyled },
      { id: "cap-black", label: "Black Denim", image: capProduct, secondaryImage: capStyled },
    ],
    sizes: ["One Size"],
  },
  {
    id: "27th-ivy-jacket",
    name: "The 27th Ivy Ja(c)ket",
    price: 120,
    category: "jacket",
    image: jacketProduct,
    secondaryImage: jacketStyled,
    description: "Denim zip jacket with embroidered C₂₇ monogram — Aldrich Nine collection",
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
    sizes: ["S", "M", "L", "XL"],
  },
];

export const categories: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cap", label: "Caps" },
  { value: "jacket", label: "Jackets" },
];

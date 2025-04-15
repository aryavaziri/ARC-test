// store/constants/iconMap.ts
import { FaShoppingCart, FaTools, FaHome } from "react-icons/fa";
import { GrDatabase } from "react-icons/gr";

export const iconMap = {
  FaShoppingCart,
  FaTools,
  FaHome,
  GrDatabase,
};

export type IconName = keyof typeof iconMap;

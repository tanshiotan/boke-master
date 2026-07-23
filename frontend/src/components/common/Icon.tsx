import {
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaPenNib,
  FaTrophy,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export const ICONS = {
  trophy: FaTrophy,
  pen: FaPenNib,
  success: FaCircleCheck,
  error: FaCircleExclamation,
  info: FaCircleInfo,
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

export function Icon({ name, className, size = 20 }: IconProps) {
  const Component: IconType = ICONS[name];
  return <Component className={className} size={size} aria-hidden />;
}

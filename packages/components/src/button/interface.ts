import { PropsWithChildren } from "react";
import { Size } from "../interface";

export type ButtonType = "primary" | "secondary" | "dashed" | "outline" | "text" | "link";
export type ButtonHtmlType = "button" | "submit" | "reset";

export type ButtonProps = PropsWithChildren<{
    size?: Size;
    type?: ButtonType;
    htmlType?: ButtonHtmlType;
    onClick?: () => void | Promise<void>;
}>

export type ButtonComponent = React.FC<ButtonProps> & {
    defaultProps?: Partial<ButtonProps>;
}
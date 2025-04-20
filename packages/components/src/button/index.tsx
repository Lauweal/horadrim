import React, { useState } from "react";
import cs from "classnames";
import { ButtonComponent } from "./interface";
import { isAsyncFunction }  from "@horadrim/tools";

const classPrefix = "button-root";

const Button: ButtonComponent = (props) => {
    const { type } = props;
    const [loading, setLoading] = useState(false);
    const className = cs({
        [classPrefix]: true,
        [`${classPrefix}-${type}`]: true,
        [`${classPrefix}-${props.size}`]: true,
    })
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        if (isAsyncFunction(props.onClick)) {
            props.onClick(e).finally(() => {
                setLoading(false);
            })
        }
    }
    
    return (<button onClick={onClick} type={props.htmlType} className={className}>{props.children}</button>)
}

Button.defaultProps = {
    type: 'primary',
    size: 'medium',
    htmlType: 'button',
}

export default Button;
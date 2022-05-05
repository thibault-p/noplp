import React from "react";

import "./TextBox.css"

export default function TextBox(props) {
    let content = props.content;
    if (content && props.hidden) {
        content = content.split(' ').map(_ => '____').join(' ');
    }

    const parenClass = props.className || '';
    return (
        <>
            <div className={`textbox ${parenClass} ${props.disabled ? "disabled" : ""}`} >
                { content }
                { props.children }
            </div>
        </>
    )
}
import React from "react";
import "./Layout.css";

export const Layout = ({ children, footer }) => {
    return (
        <div className="layout">
            <main className="main">{children}</main>
            {footer}
        </div>
    );
}

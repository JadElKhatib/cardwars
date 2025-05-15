import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export const Layout = ({ footer }) => {
    return (
        <div className="layout">
            <main className="main"><Outlet/></main>
            {footer}
        </div>
    );
};

import React from "react";

import './Logo.css';

export default function Logo() {
    return (
        <div className="logo-container">
            <div className="logo-inner">
                <div className="logo part-1" style={{animationDelay: '2.5s'}} ></div>
                <div className="logo part-2" style={{animationDelay: '3s'}} ></div>
                <div className="logo part-3" style={{animationDelay: '3.5s'}} ></div>
                <div className="logo part-4" style={{animationDelay: '4s'}} ></div>
                <div className="logo part-5" style={{animationDelay: '4.5s'}} ></div>
            </div>
        </div>
    );
}

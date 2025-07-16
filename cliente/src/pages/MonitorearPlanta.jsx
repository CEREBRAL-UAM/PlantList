import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; 
import { SecHeader } from "../components/SecHeader";

export function MonitorearPlanta() {

    return (
        <div className="min-h-screen flex flex-col">
            <SecHeader dir="/biolink_ipc/experimentos" />
        </div>
    );
}
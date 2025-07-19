import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function MonitorearPlanta() {
  return (
    <div className="min-h-screen flex flex-col">
      <BannerUsuario />
    </div>
  );
}

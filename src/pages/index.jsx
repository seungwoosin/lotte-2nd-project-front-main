import React from "react";
import '@/pages/index.scss'
import logo from "@/assets/plantryLogo.png";
import MainHeader from "../layout/rending/mainHeader";
import MainFooter from "../layout/rending/mainFooter";
import RenderDefaultLayout from "../layout/rending/RenderDefaultLayout";
import Main from "../components/render/main";

export default function MainIndex() {
  return (
    <RenderDefaultLayout>
      <Main />
    </RenderDefaultLayout>
  );
}

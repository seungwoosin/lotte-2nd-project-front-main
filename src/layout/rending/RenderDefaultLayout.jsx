import { Children } from "react";
import MainFooter from "./mainFooter";
import MainHeader from "./mainHeader";
import { Outlet } from "react-router-dom";

export default function RenderDefaultLayout(){

    return (<>
        <div id="main-container">
        <MainHeader /> 
        <main>
            <Outlet />
        </main>
        <MainFooter />
        </div>  
    
    </>);
}
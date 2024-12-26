import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
    const [menuState, setMenuState] = useState({
        isOpen: false,
        position: { top: 0, left: 0 },
    });

    const openMenu = (position) => {
        setMenuState({ isOpen: true, position });
    };

    const closeMenu = () => {
        setMenuState({ isOpen: false, position: { top: 0, left: 0 } });
    };

    return (
        <MenuContext.Provider value={{ menuState, openMenu, closeMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

import { createContext, useState, useContext } from "react";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}

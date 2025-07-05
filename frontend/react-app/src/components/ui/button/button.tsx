// button.tsx
import React from 'react';

interface ButtonProps {
  // Define tus props aquí si las tienes
  children: React.ReactNode;
  // ... otras props
}

export function Button({ children, ...props }: ButtonProps) {
  return ( // <-- AGREGAR ESTE PARÉNTESIS DE APERTURA
    <button {...props}>
      {children}
    </button>
  ); // <-- ESTE PARÉNTESIS DE CIERRE YA ESTABA, PERO AHORA CIERRA EL DE ARRIBA
}
import type { Metadata } from "next";
import "./globals.css";

// Metadados da aplicação Almoxarifado LTDA
export const metadata: Metadata = {
  title: "Almoxarifado LTDA - Gerenciamento de Estoque",
  description: "Sistema interno de controle de produtos, movimentações e operadores.",
};

// Layout raiz da aplicação web
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

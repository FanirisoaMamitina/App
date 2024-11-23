import React from "react";
import ProductSelector from "../components/ProductSelector";

function Parametre() {
  const products = [
    { id: "1", name: "Ordinateur Portable", price: 2500000 },
    { id: "2", name: "Écran LED", price: 800000 },
    { id: "3", name: "Clavier", price: 200000 },
    { id: "4", name: "Souris", price: 150000 },
    { id: "5", name: "Imprimante", price: 1200000 },
  ];

  const clients = [
    { id: "1", name: "Koto",tel:"0324566666"},
    { id: "2", name: "Rivo", tel: "0344566698"},
    { id: "3", name: "Aina", tel: "0344566698"},

  ];

  return (
    <div>
      <ProductSelector products={products} clients={clients} />
    </div>
  );
}

export default Parametre;

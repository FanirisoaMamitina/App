import React, { useState, useEffect } from "react";
import ProductSelector from "../components/ProductSelector";
import axiosClient from '../axios-client';

function Parametre() {

  const [listeProduits, setListeProduits] = useState([])
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axiosClient.get('/get-produits-disponibles').then(res => {
      if (res.status === 200) {
        setListeProduits(res.data.product);
      }
    });
  }, [])

  useEffect(() => {
    axiosClient.get('/view-clients').then(res => {
        if (res.status === 200) {
            setClients(res.data.client);
        }
    });
}, [])

  return (
    <div>
      <ProductSelector products={listeProduits} clients={clients} />
    </div>
  );
}

export default Parametre;

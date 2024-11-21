import React, { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { BiTrash, BiX } from 'react-icons/bi';
import { IoIosAdd, IoMdAlbums, IoMdTrash } from 'react-icons/io';


function AddVente() {
    const navigate = useNavigate();
    const [load, setLoad] = useState('off');
    const [produits, setProduits] = useState([{ produit: '', quantite: '', prix: '', total: '' }]);
    const [client, setClient] = useState('');
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [grandTotal, setGrandTotal] = useState(0);
    const [clients, setClients] = useState([]);
    const [listeProduits, setListeProduits] = useState([]);

    useEffect(() => {
        axiosClient.get('/view-clients').then(res => {
            if (res.status === 200) {
                setClients(res.data.client);
            }
        });
    }, [])

    useEffect(() => {
        axiosClient.get('/get-produits-disponibles').then(res => {
            if (res.status === 200) {
                setListeProduits(res.data.product);
            }
        });
    }, [])

    useEffect(() => {
        calculateGrandTotal();
    }, [produits]);

    const handleProduitChange = (index, event) => {
        const { name, value } = event.target;
        const newProduits = [...produits];
        newProduits[index][name] = value;

        // Mise à jour du prix et du total en fonction du produit sélectionné
        if (name === 'produit') {
            const selectedProduit = listeProduits.find((p) => p.id === parseInt(value));
            if (selectedProduit) {
                newProduits[index].prix = selectedProduit.prix;
            } else {
                newProduits[index].prix = '';
            }
        }

        // Calculer le total pour chaque produit
        if (name === 'quantite' || name === 'prix') {
            const quantite = parseFloat(newProduits[index].quantite) || 0;
            const prix = parseFloat(newProduits[index].prix) || 0;
            newProduits[index].total = (quantite * prix).toFixed(2);
        }

        setProduits(newProduits);
    };

    const calculateGrandTotal = () => {
        const total = produits.reduce((acc, produit) => {
            return acc + parseFloat(produit.total || 0);
        }, 0);
        setGrandTotal(total.toFixed(2));
    };

    const handleAddProduit = () => {
        setProduits([...produits, { produit: '', quantite: '', prix: '', total: '' }]);
    };

    const handleRemoveProduit = (index) => {
        const newProduits = produits.filter((_, i) => i !== index);
        setProduits(newProduits);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            client,
            date,
            produits,
            montant_total: grandTotal
        };
    
        setLoad('on');
    
        axiosClient.post('/store-vente', data)
            .then(response => {
                const Toast = swal.mixin({
                    toast: true,
                    position: "top-end",
                    background: '#333',
                    color: 'white',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = swal.stopTimer;
                        toast.onmouseleave = swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Vente enregistrée avec succès!"
                });
                navigate('/Facture', {
                    state: {
                        vente: data,  // Les informations de la vente
                        clients: client,
                        produits: produits // Les produits inclus
                    }
                });
    
                setLoad('off');
            })
            .catch(error => {
                setLoad('off');
    
                if (error.response) {
                    const status = error.response.status;
    
                    // Vérifie si l'erreur est due à un problème de stock
                    if (status === 400) {
                        swal.fire({
                            title: "Erreur de stock!",
                            text: error.response.data.error,  // Le message d'erreur envoyé par le backend
                            icon: "error",
                            background: '#333',
                            color: 'white',
                            confirmButtonColor: '#3085d6'
                        });
                    } else if (status === 422) {
                        console.error(error.response.data.errors);
                        swal.fire({
                            title: "Erreur de validation!",
                            text: "Vérifiez les données saisies.",
                            icon: "warning",
                            background: '#333',
                            color: 'white',
                            confirmButtonColor: '#3085d6'
                        });
                    } else {
                        swal.fire({
                            title: "Erreur!",
                            text: "Une erreur s'est produite lors de l'enregistrement de la vente.",
                            icon: "error",
                            background: '#333',
                            color: 'white',
                            confirmButtonColor: '#3085d6'
                        });
                    }
                } else {
                    console.error(error);
                    swal.fire({
                        title: "Erreur inconnue!",
                        text: "Une erreur s'est produite lors de l'enregistrement de la vente.",
                        icon: "error",
                        background: '#333',
                        color: 'white',
                        confirmButtonColor: '#3085d6'
                    });
                }
            });
    };
    



    return (
        <div className="container-fluid mx-auto bg-[#1B1B1B] text-textG shadow-lg rounded-md p-6 mt-3 animated fadeInDown">
            <div className='p-6'>
                <h2 className="text-2xl font-semibold mb-4 text-textG">Formulaire de Vente</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center justify-between'>
                        <div className="mb-4">
                            <label className="block font-bold mb-2 text-textG">Nom du Client</label>
                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-teal-400 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                            >
                                <option value="">Sélectionnez un client</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nom} ----Tel: {c.tel}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold mb-2">Date de Vente</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-teal-400 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                            />
                        </div>
                    </div>


                    <table className="table-auto w-full mb-6">
                        <thead>
                            <tr className="bg-gradient-to-t from-indigo-700 to-indigo-600">
                                <th className="px-4 py-2 text-white">Produit</th>
                                <th className="px-4 py-2 text-white">Quantité</th>
                                <th className="px-4 py-2 text-white">Prix</th>
                                <th className="px-4 py-2 text-white">Total</th>
                                <th className="px-4 py-2 text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((produit, index) => (
                                <tr key={index} className="bg-dark-second animated fadeInDown">
                                    <td className="px-4 py-2 animated fadeInDown">
                                        <select
                                            name="produit"
                                            value={produit.produit}
                                            onChange={(e) => handleProduitChange(index, e)}
                                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-teal-400 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                        >
                                            <option value="">Sélectionnez un produit</option>
                                            {listeProduits.map((p) => (
                                                <option key={p.id} value={p.id}>{p.category.nom_categorie}  {p.nom_produit}    ----Stock: {p.stock}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            name="quantite"
                                            value={produit.quantite}
                                            onChange={(e) => handleProduitChange(index, e)}
                                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-teal-400 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                            placeholder="Quantité"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            name="prix"
                                            value={produit.prix}
                                            readOnly
                                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-teal-400 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                            placeholder="Prix"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <span>{produit.total ? produit.total : '0.00'}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {produits.length > 1 && ( // Condition pour afficher le bouton de suppression
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduit(index)}
                                                className="bg-red-500 text-[20px] text-white p-[6px] rounded-[5px] hover:bg-red-600 transition duration-300"
                                            >
                                                <BiTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md animated fadeInDown">
                        <h3 className="text-xl font-bold text-white">Grand Total :</h3>
                        <h3 className="text-xl font-bold text-white">{grandTotal} Ar</h3>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={handleAddProduit}
                            className="bg-green-600 text-[28px] font-bold text-white p-[6px] rounded-[5px] hover:bg-green-900 transition duration-300"
                        >
                           <IoIosAdd />
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                        >
                              {load == 'on' ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Soumettre la Vente</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVente;

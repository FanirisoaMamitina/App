import React, { useEffect, useState } from 'react';
import { useParams,Link } from "react-router-dom";
import axiosClient from '../axios-client';
import { IoMdCash } from 'react-icons/io';
import { FaUser, FaBox, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

function DetailVente() {
    const { id: idVenteParam } = useParams();
    const [details, setDetails] = useState(null);

    const getInfoVente = (idVenteParam) => {
        axiosClient.get(`/get-detail/${idVenteParam}`).then((res) => {
            if (res.data.status === 200) {
                setDetails(res.data.vente);
            }
        });
    };

    useEffect(() => {
        getInfoVente(idVenteParam);
    }, [idVenteParam]);

    if (!details) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-dark-primary">
                <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
            </div>
        );
    }

    const { id ,date, montant_total, MontantRestant, TotalMontantPaye, statut_paiement, statut_reception, type_vente, clients, paiements, detaille__vente } = details;

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700">Détail de la Vente</h1>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Imprimer</button>
            </div>

            {/* General Information */}
            <div className="bg-dark-second shadow-md rounded-lg p-6 mb-6 text-textG animated fadeInDown">
                <div className="flex justify-between items-center mb-4 animated fadeInDown">
                    <div className="text-lg font-semibold">
                        <FaCalendarAlt className="inline mr-2" />
                        Date de la vente : {new Date(date).toLocaleString()}
                    </div>
                    <div className={`px-4 py-2 rounded-full text-white ${type_vente === "direct" ? "bg-indigo-600" : "bg-yellow-500"}`}>
                        Type : {type_vente}
                    </div>
                </div>
                <p className='animated fadeInDown'>Montant Total : <span className="font-bold">{montant_total} Ar</span></p>
                <p className='animated fadeInDown'>Montant Payé : <span className="font-bold">{TotalMontantPaye} Ar</span></p>
                <p className='animated fadeInDown flex items-center space-x-5'>Montant Restant : <span className="font-bold">{" "+ MontantRestant} Ar</span>
                {!(MontantRestant == 0) &&
                    <Link to={`/AddPaiement/${id}`} className="group flex  items-center gap-2 bg-indigo-500 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-decoration-none text-white hover:bg-indigo-700">
                        <IoMdCash className="size-4 fill-white" />
                        Payer Maintenant
                    </Link>
                }
                </p>
            </div>

            {/* Client Information */}
            <div className="bg-dark-second shadow-md rounded-lg p-6 mb-6 text-textG animated fadeInDown">
                <h2 className="text-lg font-semibold mb-4 animated fadeInDown"><FaUser className="inline mr-2" /> Informations du Client</h2>
                <p>Nom : <span className="font-bold animated fadeInDown">{clients.nom}</span></p>
                <p>Téléphone : <span className="font-bold animated fadeInDown">{clients.tel}</span></p>
            </div>

            {/* Payment Information */}
            <div className="bg-dark-second shadow-md rounded-lg p-6 mb-6 text-textG animated fadeInDown">
                <h2 className="text-lg font-semibold mb-4"><FaMoneyBillWave className="inline mr-2" /> Paiements</h2>
                <table className="w-full text-white border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <tr>
                            <th className="p-2 text-left">Mode</th>
                            <th className="p-2 text-left">Montant</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Ref</th>
                        </tr>
                    </thead>
                    <tbody className='animated fadeInDown'>
                        {paiements.map((paiement, index) => (
                            <tr key={index} className="bg-dark-second">
                                <td className="p-2">{paiement.ModePaiement}</td>
                                <td className="p-2">{paiement.MontantPaye} Ar</td>
                                <td className="p-2">{new Date(paiement.DatePaiement).toLocaleDateString()}</td>
                                <td className="p-2">{paiement.Ref ? paiement.Ref : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Details */}
            <div className="bg-dark-second shadow-md rounded-lg p-6 animated fadeInDown">
                <h2 className="text-lg font-semibold mb-4 text-textG"><FaBox className="inline mr-2" /> Produits</h2>
                <table className="w-full text-white border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-green-600 to-green-700">
                        <tr>
                            <th className="p-2 text-left">Produit</th>
                            <th className="p-2 text-left">Quantité</th>
                            <th className="p-2 text-left">Prix Unitaire</th>
                            <th className="p-2 text-left">Montant</th>
                        </tr>
                    </thead>
                    <tbody className='animated fadeInDown'>
                        {detaille__vente.map((detail, index) => (
                            <tr key={index} className="bg-dark-second">
                                <td className="p-2 flex items-center">
                                    <img src={`http://localhost:8000/${detail.produits.image}`} alt={detail.produits.nom_produit} className="w-10 h-10 rounded mr-4" />
                                    {detail.produits.nom_produit}
                                </td>
                                <td className="p-2">{detail.quantite}</td>
                                <td className="p-2">{detail.prix_unitaire} Ar</td>
                                <td className="p-2">{detail.prix_unitaire * detail.quantite} Ar</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DetailVente;

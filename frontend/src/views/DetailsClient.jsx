import React, { useEffect, useState } from 'react';
import {Link, useParams } from "react-router-dom";
import axiosClient from '../axios-client';
import { FaUser, FaBox, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';


function DetailsClient() {
    const { id: idClientParam } = useParams();
    const [details, setDetails] = useState(null);


    const getInfoClient = (idClientParam) => {
        axiosClient.get(`/get-detail-client/${idClientParam}`).then((res) => {
            if (res.data.status === 200) {
                setDetails(res.data.client);
            }
        });
    };

    useEffect(() => {
        getInfoClient(idClientParam);
    }, [idClientParam]);

    if (!details) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-dark-primary">
                <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
            </div>
        );
    }

    const {ventes ,nom ,id ,tel, created_at} = details;
    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700">Détail d'un client</h1>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Imprimer</button>
            </div>

            {/* Client Information */}
            <div className="bg-dark-second shadow-md rounded-lg p-6 mb-6 text-textG animated fadeInDown">
                <h2 className="text-lg font-semibold mb-4 animated fadeInDown"><FaUser className="inline mr-2" /> Informations du Client</h2>
                <p>Code : <span className="font-bold animated fadeInDown">{id}</span></p>
                <p>Date d'insertion : <span className="font-bold animated fadeInDown">{new Date(created_at).toLocaleString()}</span></p>
                <p>Nom : <span className="font-bold animated fadeInDown">{nom}</span></p>
                <p>Téléphone : <span className="font-bold animated fadeInDown">{tel}</span></p>
            </div>

            <div className="bg-dark-second shadow-md rounded-lg p-6 mb-6 text-textG animated fadeInDown">
                <h2 className="text-lg font-semibold mb-4"><FaMoneyBillWave className="inline mr-2" /> Ventes</h2>
                <table className="w-full text-white border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <tr>
                            <th className="p-2 text-left">#</th>
                            <th className="p-2 text-left">Date</th>
                            {/* <th className="p-2 text-left">Produits</th> */}
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Montant Total</th>
                            <th className="p-2 text-left">Montant Restant</th>
                            <th className="p-2 text-left">Montant payer</th>
                            <th className="p-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody className='animated fadeInDown'>
                        {ventes.map((v, index) => (
                            <tr key={index} className="bg-dark-second">
                                <td className="p-2">{v.id}</td>
                                <td className="p-2">{v.date}</td>
                                {/* <td className="p-2">
                                    {v.detaille__vente.map((detail) => (
                                        <div key={detail.id}>
                                            {detail.produits?.nom_produit || 'Produit inconnu'} {" "}
                                            <span className="font-bold">{detail.quantite} pcs </span>
                                        </div>
                                    ))}
                                </td> */}
                                <td className="p-2">
                                    {v.Status === "direct" ? (
                                        <span className="status-btn secondary-btn">{v.Status}</span>
                                    ) : v.Status === "commande" ? (
                                        <span className="status-btn info-btn">{v.Status}</span>
                                    ) : (
                                        <span className="status-btn success-btn">{v.Status}</span>
                                    )}
                                </td>

                                <td className="p-2">{v.montant_total}</td>
                                <td className="p-2">{v.MontantRestant}</td>
                                <td className="p-2">{v.TotalMontantPaye}</td>
                                <td className="p-2">
                                <Link to={`/Vente/Details/${v.id}`} ><IoEyeOutline size={23} /></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DetailsClient

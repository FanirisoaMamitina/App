import React, {useState , useEffect } from "react";
import { useLocation , useNavigate, useParams } from "react-router-dom";
import swal from 'sweetalert2';
import CountUp from "react-countup";
import { Autocomplete, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";

function AddPaiement() {
    const { state } = useLocation();
    const [paiementErrors,setPaiementErrors] =useState ([])
    const [load, setLoad] = useState('off');

    const [montant, setMontant] = useState("");
    const [modePaiement, setModePaiement] = useState("");
    const [reference, setReference] = useState("");
    const mode = [
        { id: "1", name: "Espèce" },
        { id: "2", name: "Mvola" },
        { id: "3", name: "Banque" },
    ];

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoad("on")

        const data = {
            idVente: state?.idVente, // ID de la vente passé depuis l'état
            MontantPaye: montant,
            ModePaiement: modePaiement,
            Ref: reference,
            // DatePaiement: new Date().toISOString(), // Date actuelle
        };
        
        axiosClient.post("/store-paiement", data).then((res) => {
            if (res.data.status === 200) {
                // Notification de succès
                const Toast = swal.mixin({
                    toast: true,
                    position: "top-end",
                    background: "#333",
                    color: "white",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = swal.stopTimer;
                        toast.onmouseleave = swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "success",
                    title: res.data.message,
                });
    
                // Redirection ou actions supplémentaires
                //navigate("/Ventes/List Paiements"); // Remplacez par la route appropriée
            } else if (res.data.status === 400) {
                // Gestion des erreurs de validation
                setPaiementErrors(res.data.errors); // Supposons que vous avez un état `paiementErrors` pour les erreurs
            }
    
            setLoad("off"); // Arrêt du chargement
        }).catch((error) => {
            console.error("Erreur lors de l'envoi des données : ", error);
            setLoad("off");
        });
    }

    useEffect(() => {
        if (state.status === "direct") {
            setMontant(state.totalAmount || ""); // Valeur par défaut pour paiement direct
        }
    }, [state]);


    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col h-screen">
            <div className="bg-dark-primary p-4 flex gap-4">
                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Client</h4>
                    <div className="mt-4 ml-5">
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Nom :</span>
                            <span className="font-bold text-xl">{state?.client.nom || "N/A"}</span>
                        </h6>
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Tel :</span>
                            <span className="font-bold text-xl">{state?.client.tel || "N/A"}</span>
                        </h6>
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Id Vente :</span>
                            <span className="font-bold text-xl">{state?.idVente || "N/A"}</span>
                        </h6>
                    </div>
                </div>

                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Détails</h4>
                    <div className="mt-4 ml-5">
                        <h6 className="text-indigo-400 flex items-center justify-between">
                            <span>Montant total:</span>{" "}
                            <span className="font-bold text-xl">
                                <CountUp
                                    start={0}
                                    end={state?.totalAmount || 0}
                                    separator=" "
                                    decimals={2}
                                />{" "}
                                Ar
                            </span>
                        </h6>
                        <h6 className="text-indigo-500 flex items-center justify-between">
                            Montant déjà payé:{" "}
                            <span className="font-bold text-xl">
                                <CountUp
                                    start={0}
                                    end={state?.montantPayer || 0}
                                    separator=" "
                                    decimals={2}
                                />{" "}
                                Ar
                            </span>
                        </h6>
                        <h6 className="text-yellow-600 flex items-center justify-between">
                            Montant restant:{" "}
                            <span className="font-bold text-xl">
                                <CountUp
                                    start={0}
                                    end={(state?.totalAmount - state?.montantPayer) || 0}
                                    separator=" "
                                    decimals={2}
                                />{" "}
                                Ar
                            </span>
                        </h6>
                    </div>
                </div>
            </div>

            <div className="bg-dark-second p-4 rounded shadow mx-4">
                <h4 className="font-bold mb-2 text-textG">Formulaire de Paiement</h4>
                <div className="mt-4 ml-5 flex items-center space-x-5">
                    <div className="w-full mt-[18px]">
                        <label htmlFor="montant" className="text-textG">
                            Montant à payer
                        </label>
                        <input
                            type="number"
                            value={montant}
                            onChange={(e) => setMontant(e.target.value)}
                            id="montant"
                            placeholder="Montant à payer"
                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                        />
                    </div>

                    <div className="w-full mt-[18px]">
                        <label htmlFor="selc" className="text-textG">
                            Mode de Paiement
                        </label>
                        <select
                            name="categorie_id"
                            id="selc"
                            value={modePaiement}
                            onChange={(e) => setModePaiement(e.target.value)}
                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                        >
                            <option value="" disabled>
                                Sélectionner un mode
                            </option>
                            {mode.map((item) => (
                                <option value={item.name} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full mt-[18px]">
                    <label htmlFor="ref" className="text-textG">
                        Référence du paiement
                    </label>
                    <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        id="ref"
                        placeholder="Référence du paiement"
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    />
                </div>
                <div className="flex items-center justify-end mt-5">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                         {load == 'on' ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Payer</span>}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddPaiement;

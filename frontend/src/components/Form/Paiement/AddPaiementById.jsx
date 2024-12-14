import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert2";
import CountUp from "react-countup";
import axiosClient from "../../../axios-client";

function AddPaiementById() {
    const { state } = useLocation();
    const { id: idVenteParam } = useParams();
    const navigate = useNavigate();

    const [paiementErrors, setPaiementErrors] = useState([]);
    const [load, setLoad] = useState("off");
    const [montant, setMontant] = useState("");
    const [modePaiement, setModePaiement] = useState("");
    const [reference, setReference] = useState("");
    const [details, setDetails] = useState(null);

    const mode = [
        { id: "1", name: "Espèce" },
        { id: "2", name: "Mvola" },
        { id: "3", name: "Banque" },
    ];

    const getInfoVente = (idVenteParam) => {
        axiosClient
            .get(`/ventes/${idVenteParam}`)
            .then((res) => {
                if (res.data.status === 200) {
                    setDetails(res.data.vente);
                    setMontant(res.data.vente.montant_total - res.data.vente.TotalMontantPaye);
                } else {
                    swal.fire("Erreur", "Vente introuvable", "error");
                    navigate("/Vente/List Vente");
                }
            })
            .catch((err) => {
                console.error(err);
                swal.fire("Erreur", "Une erreur s'est produite", "error");
                navigate("/Vente/List Vente");
            });
    }



    useEffect(() => {
        getInfoVente(idVenteParam)
    }, [idVenteParam, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad("on");

        const data = {
            idVente: details?.id,
            MontantPaye: montant,
            ModePaiement: modePaiement,
            Ref: reference,
            isFacture: isChecked,
        };

        axiosClient
            .post("/store-paiement", data)
            .then((res) => {
                if (res.data.status === 200) {
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
                    if (isChecked) {
                        navigate("/Facture", {
                            state: {
                                // venteId: state?.idVente,
                                vente: res.data.vente,
                                date: res.data.date,
                                factureId: res.data.idFacture,
                                client: details.clients,
                                totalAmount: details.montant_total,
                                montantPayer: state?.montantPayer,
                            },
                        });
                    } else {
                        navigate('/Vente/Liste Vente');
                    }
                } else if (res.data.status === 400) {
                    setPaiementErrors(res.data.errors);
                }
                setLoad("off");
            })
            .catch((error) => {
                console.error("Erreur lors de l'envoi des données : ", error);
                setLoad("off");
            });
    };

    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    if (!details) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-dark-primary">
                <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col h-screen">
            <div className="bg-dark-primary p-4 flex gap-4">
                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Client</h4>
                    <div className="mt-4 ml-5">
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Nom :</span>
                            <span className="font-bold text-xl">{details.clients.nom || "N/A"}</span>
                        </h6>
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Tel :</span>
                            <span className="font-bold text-xl">{details.clients.tel || "N/A"}</span>
                        </h6>
                        <h6 className="text-gray-400 flex items-center justify-between">
                            <span>Id Vente :</span>
                            <span className="font-bold text-xl">{details.id || "N/A"}</span>
                        </h6>
                    </div>
                </div>
                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Détails</h4>
                    <div className="mt-4 ml-5">
                        <h6 className="text-indigo-400 flex items-center justify-between">
                            <span>Montant total:</span>{" "}
                            <span className="font-bold text-xl">
                                <CountUp start={0} end={details.montant_total || 0} separator=" " decimals={2} /> Ar
                            </span>
                        </h6>
                        <h6 className="text-indigo-500 flex items-center justify-between">
                            Montant déjà payé:{" "}
                            <span className="font-bold text-xl">
                                <CountUp start={0} end={details.TotalMontantPaye || 0} separator=" " decimals={2} /> Ar
                            </span>
                        </h6>
                        <h6 className="text-yellow-600 flex items-center justify-between">
                            Montant restant:{" "}
                            <span className="font-bold text-xl">
                                <CountUp
                                    start={0}
                                    end={details.montant_total - details.TotalMontantPaye || 0}
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
                <div className="flex items-center justify-between mt-5">
                    <div>
                        <label htmlFor="chek" className="text-textG mx-3">Facturé</label>
                        <input type="checkbox" onChange={handleCheckboxChange} name="" id="chek" className="form-check-input" />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        disabled={load === "on"}
                    >
                        {load === "on" ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Enregistrer le paiement"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddPaiementById;

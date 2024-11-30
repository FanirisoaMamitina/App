import React, { useState } from "react";


function AddFacture() {



    return (
        <form className="relative flex flex-col h-screen ">


            <div className="bg-dark-primary shadow p-4 sticky top-0 z-10 flex gap-4 animated fadeInDown">

                <div className="flex-1 bg-dark-second p-4 rounded shadow animated fadeInDown">
                    <h4 className="font-bold mb-2 text-textG">Client</h4>

                    <input
                        type="text"
                        name="nom"
                        // value={newClient.nom}
                        // onChange={handleNewClientChange}
                        placeholder="Nom"
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px] animated fadeInDown"
                    />

                    <input
                        type="text"
                        name="tel"
                        // value={newClient.tel}
                        // onChange={handleNewClientChange}
                        placeholder="Phone"
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px] animated fadeInDown"
                    />

                </div>

                <div className="flex-1 bg-dark-second p-4 rounded shadow animated fadeInDown">
                    <h4 className="font-bold mb-2 text-textG">Client</h4>

                    <input
                        type="text"
                        name="nom"
                        // value={newClient.nom}
                        // onChange={handleNewClientChange}
                        placeholder="Nom"
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px] animated fadeInDown"
                    />

                    <input
                        type="text"
                        name="tel"
                        // value={newClient.tel}
                        // onChange={handleNewClientChange}
                        placeholder="Phone"
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px] animated fadeInDown"
                    />

                </div>

            </div>

            <div className="flex-1 scrollbar-none scrollbar-track-dark-second scrollbar-thumb-gray-line hover:scrollbar-thin overflow-y-auto bg-dark-primary p-4 animated fadeInDown">
                <table>
                    <thead>
                        <tr className='bg-gradient-to-t from-indigo-700 to-indigo-600'>
                            <th >
                                Nom du produit
                            </th>
                            <th>
                                Prix d'origine
                            </th>
                            <th>
                                Prix de vente
                            </th>
                            <th>
                                Quantité
                            </th>
                            <th>
                                Bénéfice
                            </th>
                            <th>
                                Montant total
                            </th>
                            <th>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={7} className="text-center">
                                Aucun produit sélectionné
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Montant total */}
            <div className="bg-dark-second shadow p-4 sticky bottom-0 z-10 animated fadeInDown">
                {/* {productList.length > 0 && ( */}
                <div className="flex items-center justify-between">
                    <div className="text-right font-bold text-[22px] text-white">
                        Montant Total:  Ar
                    </div>

                    <div className="flex items-center space-x-2">

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            <span>Confirmer</span>
                        </button>

                    </div>
                </div>

            </div>

        </form>
    );
}

export default AddFacture;


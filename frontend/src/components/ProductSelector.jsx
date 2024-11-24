import React, { useState } from "react";
import { Switch, Input } from '@headlessui/react'
import clsx from 'clsx'
import { Autocomplete, TextField } from '@mui/material';

function ProductSelector({ products, clients }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [productList, setProductList] = useState([]);
    const [isExistingClient, setIsExistingClient] = useState(true);
    const [clientSearch, setClientSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [newClient, setNewClient] = useState({ name: "", phone: "" });

    // Gestion recherche produit
    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredProducts(
            products.filter((product) =>
                product.nom_produit.toLowerCase().includes(term)
            )
        );
    };

    // Gestion recherche client
    const handleClientSearchChange = (e) => {
        setClientSearch(e.target.value.toLowerCase());
    };

    const handleSelectClient = (clientId) => {
        const client = clients.find((c) => c.id === clientId);
        setSelectedClient(client);
    };

    const handleNewClientChange = (e) => {
        setNewClient({
            ...newClient,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddProduct = (productId) => {
        const product = products.find((p) => p.id === productId);
        if (product && !productList.some((p) => p.id === product.id)) {
            setProductList([...productList, { ...product, quantity: 1, salePrice: product.prix_original }]);
        }
    };

    const handleQuantityChange = (id, quantity) => {
        setProductList(
            productList.map((p) =>
                p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p
            )
        );
    };

    const handleSalePriceChange = (id, salePrice) => {
        setProductList(
            productList.map((p) =>
                p.id === id ? { ...p, salePrice: parseInt(salePrice || 0) } : p
            )
        );
    };

    const handleRemoveProduct = (id) => {
        setProductList(productList.filter((p) => p.id !== id));
    };

    const calculateBenefit = (product) => {
        return (product.salePrice - product.prix_original) * product.quantity;
    };

    const calculateAmount = (product) => {
        return product.salePrice * product.quantity;
    };

    const calculateTotalAmount = () => {
        return productList.reduce((total, product) => total + calculateAmount(product), 0);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {
            client: !isExistingClient ? selectedClient : newClient,
            products: productList.map((product) => ({
                id: product.id,
                quantity: product.quantity,
                salePrice: product.salePrice,
                totalAmount: calculateAmount(product),
                benefit: calculateBenefit(product),
            })),
            totalAmount: calculateTotalAmount(),
            // isImmediatePayment: isImmediatePayment,
        };
        console.log(dataToSend)

    }



    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col h-screen ">

            <div className="bg-dark-primary shadow p-4 sticky top-0 z-10 flex gap-4">
                {/* Formulaire Client */}
                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Client</h4>

                    <label className="flex items-center mb-4">
                        <Switch
                            checked={isExistingClient}
                            onChange={() => setIsExistingClient(!isExistingClient)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-500"
                        >
                            <span
                                className={`${isExistingClient ? "translate-x-6" : "translate-x-1"
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                        <span className="ml-3 text-sm text-textG">Déjà client</span>
                    </label>

                    {!isExistingClient ? (
                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => `${option.name} (${option.tel})`}
                            value={selectedClient}
                            onChange={(event, newValue) => setSelectedClient(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Rechercher un client"
                                    variant="outlined"
                                    fullWidth
                                    className="bg-dark-primary"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { color: "white" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "white" },
                                    }}
                                />
                            )}
                        />
                    ) : (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={newClient.name}
                                onChange={handleNewClientChange}
                                placeholder="Nom"
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]"
                            />

                            <input
                                type="text"
                                name="name"
                                value={newClient.tel}
                                onChange={handleNewClientChange}
                                placeholder="Phone"
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]"
                            />
                        </>
                    )}
                </div>

                {/* Sélecteur Produit */}
                <div className="flex-1 bg-dark-second p-4 rounded shadow">
                    <h4 className="font-bold mb-2 text-textG">Produits</h4>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Rechercher un produit..."
                        className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]"
                    />
                    <div
                        className="max-h-[150px] scrollbar-none scrollbar-track-dark-second scrollbar-thumb-gray-line hover:scrollbar-thin overflow-y-auto border-3 border-teal-950 shadow-sm shadow-black appearance-none rounded-lg bg-dark-second text-textG"
                    >
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleAddProduct(product.id)}
                                    className="p-2 hover:bg-gray-800 cursor-pointer"
                                >
                                    {product.category.nom_categorie}  {product.nom_produit} (Prix d'origine: {product.prix_original} Ar)
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center">
                                Aucun produit trouvé
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 scrollbar-none scrollbar-track-dark-second scrollbar-thumb-gray-line hover:scrollbar-thin overflow-y-auto bg-dark-primary p-4">
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
                    {/* Tableau des produits */}
                    {productList.length > 0 ? (
                        <tbody>
                            {
                                productList.map((product) => {
                                    const isInvalid = product.salePrice < product.prix_original;
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                {product.nom_produit}
                                            </td>
                                            <td>
                                                {product.prix_original} Ar
                                            </td>
                                            <td>
                                                <div className="flex items-center space-x-1">
                                                    <input
                                                        type="text"
                                                        value={product.salePrice}
                                                        onChange={(e) =>
                                                            handleSalePriceChange(product.id, e.target.value.replace(/[^0-9]/g, ""))
                                                        }
                                                        className={`relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 ${isInvalid ? "border-red-700" : "border-teal-950"}`}
                                                    />
                                                    {isInvalid && (
                                                        <span
                                                            title="Le prix de vente est inférieur au prix d'origine"
                                                            style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}
                                                        >
                                                            ⚠️
                                                        </span>
                                                    )}
                                                </div>

                                            </td>
                                            <td >
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(product.id, e.target.value)
                                                    }
                                                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-[10px] py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                                />
                                            </td>
                                            <td
                                                className={`${isInvalid ? "text-red-700" : "text-gray-400"}`}
                                            >
                                                {calculateBenefit(product)} Ar
                                            </td>
                                            <td >
                                                {calculateAmount(product)} Ar
                                            </td>
                                            <td >
                                                <button
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#d9534f",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }

                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Aucun produit sélectionné
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            {/* Montant total */}
            <div className="bg-dark-second shadow p-4 sticky bottom-0 z-10">
                {productList.length > 0 && (
                    <div className="flex items-center justify-end space-x-3">
                        <div className="text-right font-bold text-[22px] text-white">
                            Montant Total: {calculateTotalAmount()} Ar
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Sauvegarder comme commande</button>
                            <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Payer immédiatement</button>

                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}

export default ProductSelector;

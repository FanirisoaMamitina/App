import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { IoIosAdd, IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi';
import { IoMdCash } from 'react-icons/io';
import { IoCash, IoCashSharp, IoEyeSharp, IoPrintOutline } from "react-icons/io5";
import axiosClient from '../axios-client';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';  // Importer la bibliothèque xlsx
import Action from '../components/dropDown';
import {
    ArchiveBoxXMarkIcon,
    ChevronDownIcon,
    PencilIcon,
    Square2StackIcon,
    TrashIcon,
} from '@heroicons/react/16/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { RxReset } from "react-icons/rx";

function Archive() {
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(false);
    const [venteList, setVente] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        getVentes();
    }, []);



    const getVentes = () => {
        setLoading(true);
        axiosClient.get('/view-archive').then(res => {
            if (res.status === 200) {
                setVente(res.data.ventes);
            }
            setLoading(false);
        });
    };


    const handleRecuperation = (id) => {
        axiosClient
            .put(`/update-type/${id}`)
            .then((res) => {
                if (res.status === 200) {
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
                        title: res.data.message
                    });
                    getVentes();
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    swal.fire({
                        title: "Erreur de stock!",
                        text: err.response.data.message,
                        icon: "error",
                        background: '#333',
                        color: 'white',
                        confirmButtonColor: '#3085d6'
                    });
                } else {
                    swal.fire({
                        title: "Erreur!",
                        text: "Une erreur inattendue s'est produite.",
                        icon: "error",
                        background: '#333',
                        color: 'white',
                        confirmButtonColor: '#3085d6'
                    });
                }
            });
    };

    const handleDelete = (id) => {
        swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette action supprimera définitivement la vente et les paiements associés.",
            icon: "warning",
            background: '#333',
            color: 'white',
            iconColor: '#d33',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient
                    .delete(`/delete-vente/${id}`)
                    .then((res) => {
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
                            title: res.data.message
                        });
                        getVentes(); // Rafraîchir la liste des ventes
                    })
                    .catch((err) => {
                        swal.fire({
                            title: "Erreur!",
                            text: err.response?.data?.message || "Une erreur est survenue.",
                            icon: "error",
                        });
                    });
            }
        });
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const filteredItems = venteList.filter((v) => {
        const searchMatch = v.clients.nom.toLowerCase().includes(searchQuery.toLowerCase()) || v.date.toLowerCase().includes(searchQuery.toLowerCase());


        const venteDate = new Date(v.date);
        const startDateMatch = startDate ? new Date(startDate) <= venteDate : true;
        const endDateMatch = endDate ? venteDate <= new Date(endDate) : true;

        return searchMatch && startDateMatch && endDateMatch;
    });

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filteredItems.map((v) => ({
                ID: v.id,
                Nom: v.clients?.nom || "Non spécifié",
                Date: new Date(v.date).toLocaleDateString(),
                Produit: v.detaille__vente
                    .map((detail) => `${detail.produits?.nom_produit || "Non spécifié"} (${detail.quantite} pcs)`)
                    .join(" + "),
                "Status": v.Status,
                "Montant total": v.montant_total.toLocaleString(),
                "Montant Restant": v.MontantRestant.toLocaleString(),
                "Montant Payer": v.TotalMontantPaye.toLocaleString(),
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ventes");

        XLSX.writeFile(wb, "ventes.xlsx");
    };


    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown">
                <div className="flex items-center justify-between p-4">
                    <div>
                        <h3 className="text-gray-400 font-medium">Archive de vente</h3>
                        <p className='text-textG text-sm'>Vente/Archive</p>
                    </div>
                </div>

                <div className='animated fadeInDown'>
                    {/* Sélecteur pour le nombre d'éléments par page, recherche et filtres de date */}
                    <div className='flex items-center justify-between mb-4 mx-4'>
                        <div>
                            <label className='text-textG mr-2'>Nombre de ligne:</label>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        {/* Recherche live */}
                        <div className='w-64 relative'>
                            <input
                                type="search"
                                className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-14 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]'
                                placeholder='Recherche...'
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <BiSearch className='text-white text-xl absolute top-[31px] left-4 z-20' />
                        </div>

                        {/* Filtre par date */}
                        <div className='flex gap-4'>
                            <div>
                                <label className='text-textG mr-2'>Date de début:</label>
                                <input type="date" value={startDate} onChange={handleStartDateChange} className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950' />
                            </div>
                            <div>
                                <label className='text-textG mr-2'>Date de fin:</label>
                                <input type="date" value={endDate} onChange={handleEndDateChange} className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950' />
                            </div>
                        </div>

                        {/* Bouton pour exporter en Excel */}
                        <button type="button" className="btn btn-success" onClick={exportToExcel}>
                            <PiMicrosoftExcelLogoFill /> Export Excel
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr className='bg-gradient-to-t from-blue-700 to-blue-600'>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Date</th>
                                <th>Produit</th>
                                <th>Type</th>
                                <th>Montant total</th>
                                <th>Montant Restant</th>
                                <th>Montant Payer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {loading &&
                            <tbody>
                                <tr>
                                    <td colSpan="9" className="text-center">Chargement...</td>
                                </tr>
                            </tbody>
                        }
                        {!loading &&
                            <tbody className='animated fadeInDown'>
                                {currentItems.map(v => (
                                    <tr key={v.id} >
                                        <td>{v.id}</td>
                                        <td>{v.clients.nom}</td>
                                        <td>{v.date}</td>
                                        <td>
                                            {v.detaille__vente.map((detail) => (
                                                <div key={detail.id}>
                                                    {detail.produits?.nom_produit || 'Produit inconnu'} {" "}
                                                    <span className="font-bold">{detail.quantite} pcs </span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <span className="status-btn close-btn">{v.type_vente}</span>
                                        </td>

                                        <td>{v.montant_total}</td>
                                        <td>{v.MontantRestant}</td>
                                        <td>{v.TotalMontantPaye}</td>
                                        <td className='flex items-center gap-2'>
                                            <Menu>
                                                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                    Options
                                                    <ChevronDownIcon className="size-4 fill-white/60" />
                                                </MenuButton>

                                                <MenuItems
                                                    transition
                                                    anchor="bottom end"
                                                    className="w-52 rounded-xl border border-white/5 bg-dark-second p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                                >
                                                    <MenuItem>
                                                        <Link to={`/Vente/Details/${v.id}`} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-decoration-none text-white">
                                                            <IoEyeSharp className="size-4 fill-white/30" />
                                                            Voir
                                                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘V</kbd>
                                                        </Link>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button onClick={() => handleRecuperation(v.id)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                            <RxReset className="size-4 fill-white/30" />
                                                            Récuperer
                                                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button onClick={() => handleDelete(v.id)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                            <TrashIcon className="size-4 fill-white/30" />
                                                            Supprimer
                                                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                                                        </button>
                                                    </MenuItem>
                                                </MenuItems>
                                            </Menu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </table>

                    {/* Pagination */}
                    <div className="pagination flex justify-center items-center mt-4">
                        {pageNumbers.map(number => (
                            <button key={number} onClick={() => handlePageChange(number)} className={`px-3 py-1 mx-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {number}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Archive;

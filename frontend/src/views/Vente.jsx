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

function Vente() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [venteList, setVente] = useState([]);
  const [venteRetard, setVenteRetard] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getVentes();
    getRetard();
  }, []);

  console.log(venteRetard)

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const maxButtons = 5; // Nombre max de boutons visibles à la fois
    const buttons = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 mx-1 rounded-md ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage > 1) {
        buttons.push(
          <button
            key="prev"
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 mx-1 rounded-md bg-gray-200"
          >
            &lt;&lt;
          </button>
        );
      }

      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        buttons.push(<span key="start-ellipsis" className="px-2 text-textG">...</span>);
      }

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 mx-1 rounded-md ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i}
          </button>
        );
      }

      if (end < totalPages) {
        buttons.push(<span key="end-ellipsis" className="px-2 text-textG">...</span>);
      }

      if (currentPage < totalPages) {
        buttons.push(
          <button
            key="next"
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 mx-1 rounded-md bg-gray-200"
          >
            &gt;&gt;
          </button>
        );
      }
    }

    return buttons;
  };


  const getVentes = () => {
    setLoading(true);
    axiosClient.get('/view-ventes').then(res => {
      if (res.status === 200) {
        setVente(res.data.ventes);
      }
      setLoading(false);
    });
  };

  const getRetard = () => {
    axiosClient.get('/number-retard').then(res => {
      setVenteRetard(res.data.commandesEnRetard);
    });
  }

  const handleRefresh = () => {
    getVentes(); // Rafraîchit la liste
  };

  const handleReception = (id) => {
    axiosClient.put(`/update-reception/${id}`).then((res) => {
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
        getRetard();
      }
    })
  };
  const handleAnnuler = (e, id) => {
    swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      background: '#333',
      color: 'white',
      iconColor: '#d33',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.put(`cancel-vente/${id}`).then(res => {
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
        });
        getVentes();
        getRetard();
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
            <h3 className="text-gray-400 font-medium">Vente</h3>
            <p className='text-textG text-sm'>Vente/Liste</p>
          </div>

          <div>
            <Link to={'/Vente/Ajout Vente'} className="flex items-center gap-1 text-decoration-none text-white bg-indigo-600 rounded-md px-3 py-2 btn-sh hover:bg-indigo-700 transition-all duration-500">
              <span>Ajouter</span>
              <IoIosAdd size={20} />
            </Link>
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
                <th>Status</th>
                <th>Montant total</th>
                <th>Montant Restant</th>
                <th>Montant Payer</th>
                <th>Etat</th>
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
                  <tr key={v.id} className={` ${v.type_vente === "commande" &&
                    v.statut_reception === "en attente" &&
                    new Date(v.DateReception) <= new Date() ? 'bg-yellow-950' : null}`}>
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
                      {v.statut_paiement === "non payé" ? (
                        <span className="status-btn close-btn">{v.statut_paiement}</span>
                      ) : v.statut_paiement === "partiellement payé" ? (
                        <span className="status-btn info-btn">{v.statut_paiement}</span>
                      ) : (
                        <span className="status-btn success-btn">{v.statut_paiement}</span>
                      )}
                    </td>

                    <td>{v.montant_total}</td>
                    <td>{v.MontantRestant}</td>
                    <td>{v.TotalMontantPaye}</td>
                    <td>
                      {v.statut_reception === "en attente" ? (
                        <span className="status-btn orange-btn">{v.statut_reception}</span>
                      ) : (
                        <span className="status-btn secondary-btn">{v.statut_reception}</span>
                      )}
                    </td>
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
                          {!(v.MontantRestant == 0 && v.statut_paiement === "payé") &&
                            <MenuItem>
                              <Link to={`/AddPaiement/${v.id}`} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-decoration-none text-white">
                                <IoMdCash className="size-4 fill-white/30" />
                                Paiement
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘P</kbd>
                              </Link>
                            </MenuItem>
                          }
                          {v.type_vente === "commande" && v.MontantRestant == 0 && v.statut_paiement === "payé" && v.statut_reception === "en attente" &&
                            (<MenuItem>
                              <button onClick={() => handleReception(v.id)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <IoMdCheckmark className="size-4 fill-white/30" />
                                Réceptionner
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                              </button>
                            </MenuItem>
                            )
                          }
                          {v.type_vente === "commande" && !(v.statut_paiement === "payé") && v.statut_reception === "en attente" &&
                            (<MenuItem>
                              <button onClick={(e) => handleAnnuler(e, v.id)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <IoMdClose className="size-4 fill-white/30" />
                                Annuler
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                              </button>
                            </MenuItem>
                            )
                          }
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            }
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between px-4">
            {/* Affichage des commandes en retard */}
            <div className="text-textG font-medium">
              {venteRetard > 0 ? (
                <>
                  <span className="text-red-500">Commandes en retard :</span> {venteRetard}
                </>
              ) : (
                "Aucune commande en retard"
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              {renderPageNumbers()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Vente;

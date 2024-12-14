import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { IoIosAdd } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi';
import { IoEyeSharp, IoPrintOutline } from "react-icons/io5";
import axiosClient from '../axios-client';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';  // Importer la bibliothèque xlsx
import Action from '../components/dropDown';

function Vente() {
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
    axiosClient.get('/view-ventes').then(res => {
      if (res.status === 200) {
        setVente(res.data.ventes);
      }
      setLoading(false);
    });
  };

  const deleteProduct = (e, id) => {
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
        axiosClient.delete(`delete-produit/${id}`).then(res => {
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
            title: res.data.result
          });
        });
        getVentes();
      }
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Recherche en live par nom ou date
  const filteredItems = venteList.filter((v) => {
    const searchMatch = v.clients.nom.toLowerCase().includes(searchQuery.toLowerCase()) || v.date.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrage par date
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
    setItemsPerPage(Number(e.target.value));  // Changer le nombre d'éléments par page
    setCurrentPage(1);  // Réinitialiser à la première page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // Mettre à jour la valeur de recherche
    setCurrentPage(1);  // Réinitialiser à la première page lors de la recherche
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);  // Mettre à jour la date de début
    setCurrentPage(1);  // Réinitialiser à la première page
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);  // Mettre à jour la date de fin
    setCurrentPage(1);  // Réinitialiser à la première page
  };

  // Fonction pour exporter les données en fichier Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredItems.map((v) => ({
        ID: v.id,
        Nom: v.clients?.nom || "Non spécifié", // Vérification pour éviter les erreurs si le client est null
        Date: new Date(v.date).toLocaleDateString(), // Formatage de la date
        Produit: v.detaille__vente // Accéder correctement aux détails de vente
          .map((detail) => `${detail.produits?.nom_produit || "Non spécifié"} (${detail.quantite} pcs)`)
          .join(" + "),
        "Status": v.Status,
        "Montant total": v.montant_total.toLocaleString(),
        "Montant Restant": v.MontantRestant.toLocaleString(),
        "Montant Payer": v.TotalMontantPaye.toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new(); // Créer un nouveau classeur
    XLSX.utils.book_append_sheet(wb, ws, "Ventes"); // Ajouter la feuille au classeur

    XLSX.writeFile(wb, "ventes.xlsx"); // Exporter le fichier sous le nom "ventes.xlsx"
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
                <th>Total Montant Payer</th>
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
                  <tr key={v.id}>
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
                      {v.Status === "direct" ? (
                        <span className="status-btn secondary-btn">{v.Status}</span>
                      ) : v.Status === "commande" ? (
                        <span className="status-btn info-btn">{v.Status}</span>
                      ) : (
                        <span className="status-btn success-btn">{v.Status}</span>
                      )}
                    </td>

                    <td>{v.montant_total}</td>
                    <td>{v.MontantRestant}</td>
                    <td>{v.TotalMontantPaye}</td>
                    <td className='flex items-center gap-2'>
                      <Action data={v} />
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

export default Vente;

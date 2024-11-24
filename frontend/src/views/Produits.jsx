import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { IoIosAdd, IoIosTrash, IoMdTrash } from 'react-icons/io'
import { Link, useLocation } from 'react-router-dom'
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi'
import axiosClient from '../axios-client'
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


function Produits() {

  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false);
  const [produitList, setProduitList] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    getProduits();
  }, [])

  const handleFilter = (e) => {
    if (e.target.value == '') {
      setProduitList(searchApiData);
    } else {
      const filterResult = searchApiData.filter(item => item.category.nom_categorie.toLowerCase().includes(e.target.value.toLowerCase()) || item.nom_produit.toLowerCase().includes(e.target.value.toLowerCase()) || item.marque_produit.toLowerCase().includes(e.target.value.toLowerCase()) || item.description_produit.toLowerCase().includes(e.target.value.toLowerCase()))
      setProduitList(filterResult);
    }
    setFilterValue(e.target.value);
  }

  const getProduits = () => {
    setLoading(true)
    axiosClient.get('/view-produits').then(res => {
      if (res.status === 200) {
        setProduitList(res.data.product);
        setSearchApiData(res.data.product)
      }
      setLoading(false);
    });

  }

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
        })
        getProduits();

      }
    });
  }


  const exportToExcel = () => {
    // Préparer les données en format JSON pour XLSX
    const data = produitList.map(p => ({
      ID: p.id,
      Catégorie: p.category.nom_categorie,
      Nom: p.nom_produit,
      Marque: p.marque_produit,
      Description: p.description_produit,
      'Prix d\'origine': p.prix_original,
      Stock: p.stock,
    }));

    // Créer une nouvelle feuille Excel avec les données
    const ws = XLSX.utils.json_to_sheet(data);

    // Créer un nouveau classeur et y ajouter la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produits");

    // Exporter le fichier Excel sous le nom "produits.xlsx"
    XLSX.writeFile(wb, "produits.xlsx");
  };

  return (
    <div className='mt-[12px]'>
      <div className="car animated fadeInDown">
        <div className="flex items-center justify-between p-4" >
          <div>
            <h3 className="text-gray-400 font-medium" >Produits</h3>
            <p className='text-textG text-sm' >Produits/Liste</p>
          </div>
          <div>
            <Link to={'/Produits/Add Produits'} className="flex items-center gap-1 text-decoration-none text-white bg-indigo-600 rounded-md px-3 py-2 btn-sh hover:bg-indigo-700 transition-all duration-500">
              <span>Ajouter</span>
              <IoIosAdd size={20} />
            </Link>
          </div>
        </div>

        <div className='animated fadeInDown'>
          <div className='flex items-center justify-between mb-4 mx-4'>
            <div className='w-64' >
              <input type="search" value={filterValue} onInput={(e) => handleFilter(e)} className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-14 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]' placeholder='Recherche...' />
              <BiSearch className='text-white text-xl absolute top-[31px] z-20 left-10' />
            </div>
            <div className='w-44 flex items-center gap-3'>
              <label for="inputState" className='text-textG'>State</label>
              <select id="inputState" class="form-control">
                <option selecte>Choose...</option>
                <option>...</option>
              </select>
            </div>

            <div className='w-44 flex items-center gap-3'>
              <label for="inputState" className='text-textG'>State</label>
              <select id="inputState" class="form-control">
                <option selected>Choose...</option>
                <option>...</option>
              </select>
            </div>

            <button type="button" onClick={exportToExcel} class="btn btn-success"><PiMicrosoftExcelLogoFill /></button>



          </div>

          <table>
            <thead>
              <tr className='bg-gradient-to-t from-indigo-700 to-indigo-600'>
                <th>ID</th>
                <th>Image</th>
                <th>Categorie</th>
                <th>Nom</th>
                <th>Marque</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading &&
              <tbody>
                <tr>
                  <td colSpan="9" className="text-center">
                    Chargement...
                  </td>
                </tr>
              </tbody>
            }:{!loading &&
              <tbody className='animated fadeInDown'>
                {produitList.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-textG">
                      Aucun résultat trouvé
                    </td>
                  </tr>
                ) : (
                  produitList.map(p => (
                    <tr key={p.id} className={` ${p.stock < 5 ? 'bg-red-900' : null} `}>
                      <td>{p.id}</td>
                      <td><img src={`http://localhost:8000/${p.image}`} className='rounded-md shadow-md shadow-black' width={40} alt={p.nom_produit} /></td>
                      <td>{p.category.nom_categorie}</td>
                      <td>{p.nom_produit}</td>
                      <td>{p.marque_produit}</td>
                      <td>{p.description_produit}</td>
                      <td>{p.prix_original}</td>
                      <td>{p.stock}</td>
                      <td className='flex items-center gap-2 py-4'>
                        <Link to={`/Produits/Edit Produit/${p.id}`} className="text-yellow-500 text-xl p-1 rounded-md hover:text-yellow-800 shadow-md shadow-yellow-900 duration-500"><FiEdit /></Link>
                        <button type='button' onClick={(e) => deleteProduct(e, p.id)} className="text-red-500 p-1 rounded-md text-xl shadow-md shadow-red-900 hover:text-red-800 duration-500"><BiTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            }

          </table>
        </div>
      </div>
    </div>
  )
}

export default Produits

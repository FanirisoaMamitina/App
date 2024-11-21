import React, { useState } from 'react'
import { Button } from '@mui/material'
import { IoIosAdd, IoIosTrash, IoMdTrash } from 'react-icons/io'
import { Link, useLocation } from 'react-router-dom'
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi'
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useEffect } from 'react'
import axiosClient from '../axios-client'
import swal from 'sweetalert2';


function Categories() {

  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [categorieList, setCategorieList] = useState([])

  useEffect(() => {
    getCategorie();
  }, [])

  const getCategorie = () => {
    setLoading(true)
    axiosClient.get('/view-category').then(res => {
      if (res.status === 200) {
        setCategorieList(res.data.category);
      }
      setLoading(false);
    });

  }

  const deleteCategory = (e, id) => {
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
        axiosClient.delete(`delete-category/${id}`).then(res => {
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
      getCategorie();

      }
    });


  }

  const statusSelect = [
    {name: "Tous", key: "2"},
    {name: "Active", key: "1"},
    {name: "Desactive", key: "0"},
  ]

  return (
    <div className='mt-[12px]'>
      <div className="car animated fadeInDown">
        <div className="flex items-center justify-between p-4" >
          <div>
            <h3 className="text-gray-400 font-medium" >Categories</h3>
            <p className='text-textG text-sm' >Produits/Categories</p>
          </div>
          <div>
            <Link to={'/Produits/Add Categories'} className="flex items-center gap-1 text-decoration-none text-white bg-indigo-600 rounded-md px-3 py-2 btn-sh hover:bg-indigo-700 transition-all duration-500">
              <span>Ajouter</span>
              <IoIosAdd size={20} />
            </Link>
          </div>
        </div>

        <div className='animated fadeInDown'>
          <div className='flex items-center justify-between mb-4 mx-4'>
            <div className='w-44 flex items-center gap-3'>
              <label for="inputState" className='text-textG'>State</label>
              <select id="inputState" class="form-control">
                {
                  statusSelect.map(m => (
                    <option key={m.key}>{m.name}</option>
                  ))
                }
              </select>
            </div>

            <button type="button" class="btn btn-success"><PiMicrosoftExcelLogoFill /></button>

          </div>

          <table>
            <thead>
              <tr className='bg-gray-line'>
                <th>ID</th>
                <th>Nom</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading &&
              <tbody>
                <tr>
                  <td colSpan="5" class="text-center">
                    Chargement...
                  </td>
                </tr>
              </tbody>
            }
            {!loading &&
              <tbody>
                {categorieList.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nom_categorie}</td>
                    <td>{c.status_categorie ? <span className="status-btn success-btn">Active</span> : <span className="status-btn close-btn">Desactive</span>}</td>
                    <td className='flex items-center gap-2'>
                      <Link to={`/Produits/Edit Categories/${c.id}`} className="text-yellow-500 text-xl p-1 rounded-md hover:text-yellow-800 shadow-md shadow-yellow-900 duration-500" ><FiEdit /></Link>
                      &nbsp; &nbsp;
                      <button type='button' onClick={(e) => deleteCategory(e, c.id)} className="text-red-500 p-1 rounded-md text-xl shadow-md shadow-red-900 hover:text-red-800 duration-500" ><BiTrash /></button>
                    </td>
                  </tr>
                ))}

              </tbody>
            }
          </table>
        </div>
      </div>
    </div>
  )
}

export default Categories

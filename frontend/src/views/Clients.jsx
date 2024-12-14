import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { IoIosAdd, IoIosTrash, IoMdTrash } from 'react-icons/io'
import { Link, useLocation } from 'react-router-dom'
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi'
import axiosClient from '../axios-client';
import swal from 'sweetalert2';
import { IoEyeOutline } from 'react-icons/io5';
import * as XLSX from 'xlsx';

function Clients() {

  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    getClients();
  }, [])

  const handleFilter = (e) => {
    if (e.target.value == '') {
      setClientsList(searchApiData);
    } else {
      const filterResult = searchApiData.filter(item => item.nom.toLowerCase().includes(e.target.value.toLowerCase()) || item.tel.toLowerCase().includes(e.target.value.toLowerCase()))
      setClientsList(filterResult);
    }
    setFilterValue(e.target.value);
  }

  const getClients = () => {
    setLoading(true)
    axiosClient.get('/view-clients').then(res => {
      if (res.status === 200) {
        setClientsList(res.data.client);
        setSearchApiData(res.data.client);
      }
      setLoading(false);
    });

  }

  const deleteClient = (e, id , name) => {
    swal.fire({
      title: "Etez vous sur?",
      text: `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`,
      icon: "warning",
      background: '#333',
      color: 'white',
      iconColor: '#d33',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Non",
      confirmButtonText: "Oui, supprimer"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`delete-client/${id}`).then(res => {
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
        getClients();

      }
    });


  }

  const exportToExcel = () => {
    const data = clientsList.map(cli => ({
      ID: cli.id,
      Nom: cli.nom,
      Tel: cli.tel,
    }));
    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client");
    XLSX.writeFile(wb, "client.xlsx");
  };

  return (
    <div className='mt-[12px]'>
      <div className="car animated fadeInDown">
        <div className="flex items-center justify-between p-4" >
          <div>
            <h3 className="text-gray-400 font-medium" >Clients</h3>
            <p className='text-textG text-sm' >Clients/Liste</p>
          </div>
          <div>
            <Link to={'/Clients/Ajout Clients'} className="flex items-center gap-1 text-decoration-none text-white bg-indigo-600 rounded-md px-3 py-2 btn-sh hover:bg-indigo-700 transition-all duration-500">
              <span>Ajouter</span>
              <IoIosAdd size={20} />
            </Link>
          </div>
        </div>

        <div className='animated fadeInDown'>
          <div className='flex items-center justify-between mb-4 mx-4'>
            <div className='w-64' >
              <input type="search" value={filterValue} onInput={(e) => handleFilter(e)} className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-14 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]' placeholder='Recherche...' />
              <BiSearch className='text-white text-xl absolute top-[31px] left-10 z-20' />
            </div>

            <button type="button" onClick={exportToExcel} class="btn btn-success"><PiMicrosoftExcelLogoFill /></button>

          </div>

          <table>
            <thead>
              <tr className='bg-gradient-to-t from-indigo-700 to-indigo-600'>
                <th>ID</th>
                <th>Nom</th>
                <th>Telephone</th>
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
                {clientsList.map(cli => (
                  <tr key={cli.id}>
                    <td>{cli.id}</td>
                    <td>{cli.nom}</td>
                    <td>{cli.tel}</td>
                    <td className='flex items-center gap-2'>
                      <Link to={`/Clients/Details/${cli.id}`} className="text-indigo-500 text-xl p-1 rounded-md hover:text-indigo-800 shadow-md shadow-indigo-900 duration-500"><IoEyeOutline /></Link>
                      &nbsp; &nbsp;
                      <Link to={`/Clients/Edit Client/${cli.id}`} className="text-yellow-500 text-xl p-1 rounded-md hover:text-yellow-800 shadow-md shadow-yellow-900 duration-500"><FiEdit /></Link>
                      &nbsp; &nbsp;
                      <button type='button' onClick={(e) => deleteClient(e, cli.id ,cli.nom)} className="text-red-500 p-1 rounded-md text-xl shadow-md shadow-red-900 hover:text-red-800 duration-500" ><BiTrash /></button>
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

export default Clients

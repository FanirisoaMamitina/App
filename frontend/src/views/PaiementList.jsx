import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client';
import { IoIosAdd, IoIosTrash, IoMdTrash } from 'react-icons/io'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiEdit } from "react-icons/fi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiDownload, BiPencil, BiSearch, BiTrash } from 'react-icons/bi'

function PaiementList() {

    const [paiement , setPaiement] = useState([]);
    const [loading , setLoading] = useState(false);
    const [searchApiData, setSearchApiData] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        getClients()
    },[])

    const handleFilter = (e) => {
        if (e.target.value == '') {
            setPaiement(searchApiData);
        } else {
          const filterResult = searchApiData.filter(item => item.vente.clients.nom.toLowerCase().includes(e.target.value.toLowerCase())  ||  item.vente.clients.tel.toLowerCase().includes(e.target.value.toLowerCase()) ||  item.ModePaiement.toLowerCase().includes(e.target.value.toLowerCase()))
          setPaiement(filterResult);
        }
        setFilterValue(e.target.value);
      }

    const getClients = () => {
        setLoading(true)
        axiosClient.get('/getPaiement').then(res => {
            if (res.status === 200) {
                setPaiement(res.data.paiement);
                setSearchApiData(res.data.paiement);
            }
            setLoading(false);
        });
    }
    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown">
                <div className="flex items-center justify-between p-4" >
                    <div>
                        <h3 className="text-gray-400 font-medium" >Paiement</h3>
                        <p className='text-textG text-sm' >Paiement/Liste</p>
                    </div>
                    <div>
                        <Link to={'/Clients/Add Clients'} className="flex items-center gap-1 text-decoration-none text-white bg-indigo-600 rounded-md px-3 py-2 btn-sh hover:bg-indigo-700 transition-all duration-500">
                            <span>Ajouter</span>
                            <IoIosAdd size={20} />
                        </Link>
                    </div>
                </div>

                <div className='animated fadeInDown'>
                    <div className='flex items-center justify-between mb-4 mx-4'>
                        <div className='w-64' >
                            <input type="search"  value={filterValue} onInput={(e) => handleFilter(e)} className='relative block w-full shadow-sm shadow-black appearance-none rounded-lg pl-14 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950 mt-[18px]' placeholder='Recherche...' />
                            <BiSearch className='text-white text-xl absolute top-[31px] left-10 z-20' />
                        </div>

                        <button type="button" class="btn btn-success"><PiMicrosoftExcelLogoFill /></button>

                    </div>

                    <table>
                        <thead>
                            <tr className='bg-gradient-to-t from-indigo-700 to-indigo-600'>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Telephone</th>
                                <th>Date</th>
                                <th>Montant Payer</th>
                                <th>Mode de payement</th>
                                <th>Reference</th>
                            </tr>
                        </thead>
                        {loading &&
                            <tbody>
                                <tr>
                                    <td colSpan="9" class="text-center">
                                        Chargement...
                                    </td>
                                </tr>
                            </tbody>
                        }
                        {!loading &&
                            <tbody className='animated fadeInDown'>
                                {paiement.map(pay => (
                                    <tr key={pay.id}>
                                        <td>{pay.id}</td>
                                        <td>{pay.vente.clients.nom}</td>
                                        <td>{pay.vente.clients.tel}</td>
                                        <td>{pay.DatePaiement}</td>
                                        <td>{pay.MontantPaye}</td>
                                        <td>{pay.ModePaiement}</td>
                                        <td>{pay.Ref ? pay.Ref : "N/A"}</td>
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

export default PaiementList

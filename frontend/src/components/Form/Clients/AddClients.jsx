import React, { useState } from 'react'
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import axiosClient from '../../../axios-client';
import clientImg from '../../../assets/image/svg.svg';

function AddClients() {

    const navigate = useNavigate();

    const [clientInput, setClients] = useState({
        nom: '',
        tel: '',
        error_list: [],
    });

    const [load, setLoad] = useState('off');

    const handleInput = (e) => {
        e.persist();
        setClients({ ...clientInput, [e.target.name]: e.target.value })
    }


    const submintClient = (e) => {
        e.preventDefault();
        setLoad('on');

        const data = {
            nom: clientInput.nom,
            tel: clientInput.tel,
        }

        axiosClient.post('/store-clients', data).then(res => {
            if (res.data.status === 200) {
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
                navigate('/Clients/List Clients')
            } else (res.data.status === 400)
            {
                setClients({ ...clientInput, error_list: res.data.errors })
            }
            setLoad('off');
        });

    }

    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown p-5">
                <div>
                    <h3 className="text-gray-400 font-medium" >Nouvelle client</h3>
                    <p className='text-textG text-sm' >Clients/Ajouter</p>
                </div>
                <form onSubmit={submintClient} className='p-4' id='CATEGORY_FORM'>
                    <div className="flex items-center justify-between">

                        <div>
                            <img width={250} src={clientImg} alt="" />
                        </div>

                        <div className="form-group col-md-6">
                            <div className='mb-3'>
                                <label htmlFor="Nom" className='text-textG'>Nom</label>
                                <input
                                    type="text"
                                    name='nom'
                                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                    id="Nom"
                                    placeholder="Nom"
                                    onChange={handleInput}
                                    value={clientInput.nom}
                                />
                                {clientInput.error_list && (
                                    <span className='text-red-600 text-sm mt-1'>{clientInput.error_list.nom}</span>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Tel" className='text-textG'>Telephone</label>
                                <input
                                    type="text"
                                    name='tel'
                                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                    id="Tel"
                                    placeholder="Tel"
                                    onChange={handleInput}
                                    value={clientInput.tel}
                                />
                                {clientInput.error_list && (
                                    <span className='text-red-600 text-sm mt-1'>{clientInput.error_list.tel}</span>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="btn btn-primary">
                            {load == 'on' ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Enregistrer</span>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddClients

import React, { useState, useEffect } from 'react'
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import axiosClient from '../../../axios-client';
import clientImg from '../../../assets/image/svg.svg';

function EditClient() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [clientInput, setClient] = useState([]);
    const [error_list, setErrors] = useState([]);

    useEffect(() => {
        setLoad('on');
        axiosClient.get(`/edit-client/${id}`).then(res => {

            if (res.data.status === 200) {
                setClient(res.data.client);
            } else if (res.data.status === 404) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: res.data.message
                });
                navigate('/Clients/List Clients');
            }
            setLoad('off');
        });
    }, [id, navigate]);

    const [load, setLoad] = useState('off');
    const [loader, setLoader] = useState(false);

    const handleInput = (e) => {
        e.persist();
        setClient({ ...clientInput, [e.target.name]: e.target.value })
    }


    const updateClient = (e) => {
        e.preventDefault();

        setLoader(true);

        const data = clientInput;

        axiosClient.put(`/update-client/${id}`, data).then(res => {
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
                navigate('/Clients/List Clients');
                setErrors([]);
            } else if (res.data.status === 422) {
                setErrors(res.data.errors)
            } else if (res.data.status === 404) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    background: '#333',
                    text: res.data.message
                });
                navigate('/Clients/List Clients');
            }
            setLoader(false);
        });

    }

    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown p-5">
                <div>
                    <h3 className="text-gray-400 font-medium" >Modifier client</h3>
                    <p className='text-textG text-sm' >Clients/Modifier</p>
                </div>
                {load === 'on' &&
                    <div className='text-center text-white'>
                        Chargement...
                    </div>
                }
                {load === 'off' && <form onSubmit={updateClient} className='p-4' id='CATEGORY_FORM'>
                    <div className="flex items-center justify-between">

                        <div>
                            <img width={250} src={clientImg} alt="" />
                        </div>

                        <div className="form-group col-md-6">
                            <div className='mb-3'>
                                <label for="Nom" className='text-textG'>Nom</label>
                                <input
                                    type="text"
                                    name='nom'
                                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                    id="Nom"
                                    placeholder="Nom"
                                    onChange={handleInput}
                                    value={clientInput.nom}
                                />
                                {error_list && (
                                    <span className='text-red-600 text-sm'>{error_list.nom}</span>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label for="Tel" className='text-textG'>Telephone</label>
                                <input
                                    type="text"
                                    name='tel'
                                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                    id="Tel"
                                    placeholder="Tel"
                                    onChange={handleInput}
                                    value={clientInput.tel}
                                />
                                {error_list && (
                                    <span className='text-red-600 text-sm'>{error_list.tel}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="btn btn-primary">
                            {loader ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Enregistrer</span>}
                        </button>
                    </div>

                </form>
                }
            </div>
        </div>
    )
}

export default EditClient

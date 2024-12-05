import React, { useState } from 'react'
import axiosClient from '../../axios-client';
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

function EditCategories() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [categorieInput, setCategorie] = useState([]);
    const [error, setErrors] = useState([]);

    useEffect(() => {
        setLoad('on');
        axiosClient.get(`/edit-category/${id}`).then(res => {
            if (res.data.status === 200) {
                setCategorie({
                    ...res.data.category,
                    status_categorie: res.data.category.status_categorie
                });
                console.log(res.data.category.status_categorie)
            } else if (res.data.status === 404) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: res.data.message
                });
                navigate('/Produits/Categories');
            }
            setLoad('off');
        });
    }, [id, navigate]);


    const [load, setLoad] = useState('off');
    const [loader, setLoader] = useState(false);

    const handleInput = (e) => {
        e.persist();
        setCategorie({ ...categorieInput, [e.target.name]: e.target.value })
    }


    const updateCategory = (e) => {
        e.preventDefault();

        setLoader(true);

        const data = categorieInput;

        axiosClient.put(`/update-category/${id}`, data).then(res => {
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
                navigate('/Produits/Categories')
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
                navigate('/Produits/Categories');
            }
            setLoader(false);
        });

    }

    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown p-5">
                <div>
                    <h3 className="text-gray-400 font-medium" >Éditer la catégorie</h3>
                    <p className='text-textG text-sm' >Produits/categorie</p>
                </div>
                {load === 'on' &&
                    <div className='text-center text-white'>
                        Chargement...
                    </div>
                }
                {load === 'off' && <form onSubmit={updateCategory} className='p-4' id='CATEGORY_FORM'>
                    <div className="flex items-center justify-between">

                        <div>
                            <p className='text-textG text-xl'>Modifier la catégorie</p>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="NomCat" className='text-textG'>Nom de Categorie</label>
                            <input
                                type="text"
                                name='nom_categorie'
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                id="NomCat"
                                placeholder="Nom"
                                onChange={handleInput}
                                value={categorieInput.nom_categorie}
                            />
                            {error.nom_categorie && (
                                <span className='text-red-600 text-sm mt-1'>{error.nom_categorie}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="form-check">
                            <input
                                name='status_categorie'
                                className="form-check-input"
                                type="checkbox"
                                id="gridCheck"
                                onChange={(e) => setCategorie({ ...categorieInput, status_categorie: e.target.checked ? 1 : 0 })}
                                checked={categorieInput.status_categorie === 1}
                            />
                            <label className="form-check-label text-textG" htmlFor="gridCheck">
                                Status
                            </label>
                        </div>
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

export default EditCategories

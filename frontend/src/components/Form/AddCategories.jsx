import React, { useState } from 'react'
import axiosClient from '../../axios-client';
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

function AddCategories() {

    const navigate = useNavigate();

    const [categorieInput, setCategorie] = useState({
        nom_categorie: '',
        status_categorie: '',
        error_list: [],
    });

    const [load, setLoad] = useState('off');

    const handleInput = (e) => {
        e.persist();
        setCategorie({ ...categorieInput, [e.target.name]: e.target.value })
    }


    const submitCategory = (e) => {
        e.preventDefault();
        setLoad('on');

        const data = {
            nom_categorie: categorieInput.nom_categorie,
            status_categorie: categorieInput.status_categorie,
        }

        axiosClient.post('/store-category', data).then(res => {
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
            } else (res.data.status === 400)
            {
                setCategorie({ ...categorieInput, error_list: res.data.errors })
            }
            setLoad('off');
        });

    }

    return (
        <div className='mt-[12px]'>
            <div className="car animated fadeInDown p-5">
                <div>
                    <h3 className="text-gray-400 font-medium" >Nouvelle catégorie</h3>
                    <p className='text-textG text-sm' >Produits/categorie</p>
                </div>
                <form onSubmit={submitCategory} className='p-4' id='CATEGORY_FORM'>
                    <div className="flex items-center justify-between">

                        <div>
                            <p className='text-textG text-xl'>Créer une nouvelle catégorie</p>
                        </div>

                        <div className="form-group col-md-6">
                            <label for="NomCat" className='text-textG'>Nom de Categorie</label>
                            <input
                                type="text"
                                name='nom_categorie'
                                className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                                id="NomCat"
                                placeholder="Nom"
                                onChange={handleInput}
                                value={categorieInput.nom_categorie}
                            />
                            {categorieInput.error_list && (
                                <span className='text-red-600 text-sm mt-1'>{categorieInput.error_list.nom_categorie}</span>
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
                                onChange={(e) => setCategorie({ ...categorieInput, status_categorie: e.target.checked ? '1' : '0' })}
                                checked={categorieInput.status_categorie === '1'}
                            />
                            <label className="form-check-label text-textG" for="gridCheck">
                                Status
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            {load == 'on' ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Enregistrer</span>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddCategories

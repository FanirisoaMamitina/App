import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { IoIosCamera } from "react-icons/io";


function AddProduits() {
  const navigate = useNavigate();
  const [load, setLoad] = useState('off');
  const [categoryList, setCategoryList] = useState([]);
  const [produitInput, setProduit] = useState({
    categorie_id: '',
    nom_produit: '',
    marque_produit: '',
    description_produit: '',
    prix_original: '',
    prix: '',
    stock: '',
    error_list: [],
  });

  useEffect(() => {
    axiosClient.get('/all-category').then(res => {
      if (res.status === 200) {
        setCategoryList(res.data.category);
      }
    });
  }, [])

  const handleInput = (e) => {
    e.persist();
    setProduit({ ...produitInput, [e.target.name]: e.target.value })
  }

  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState([]);

  const handleImageChange = (e) => {
    setPicture({ image: e.target.files[0] });
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProduit = (e) => {
    e.preventDefault();
    setLoad('on')

    const formData = new FormData();
    formData.append('image', picture.image);
    formData.append('categorie_id', produitInput.categorie_id);

    formData.append('nom_produit', produitInput.nom_produit);
    formData.append('marque_produit', produitInput.marque_produit);
    formData.append('description_produit', produitInput.description_produit);

    formData.append('prix_original', produitInput.prix_original);
    formData.append('prix', produitInput.prix);
    formData.append('stock', produitInput.stock);

    axiosClient.post('/store-product', formData).then(res => {
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
        navigate('/Produits/Liste Produits')
      } else if (res.data.status === 422) {
        setProduit({ ...produitInput, error_list: res.data.errors })
      }
      setLoad('off');
    });
  }

  return (
    <div className="mt-[12px]">
      <div className="car animated fadeInDown p-5">
        <div>
          <h3 className="text-gray-400 font-medium" >Nouveau Produit</h3>
          <p className='text-textG text-sm' >Produits/Ajouter</p>
        </div>
        <form onSubmit={submitProduit} className='p-4' id='CATEGORY_FORM'>
          <div className="flex items-center justify-between">

            <div>
              <p className='text-textG text-xl'>Détail d'un produit</p>
              <label htmlFor="inputImg" className="cursor-pointer">
                {image ? (<img src={image} alt="Selected" width={300} accept="image/*" className="rounded shadow-md shadow-dark-primary" />)
                  : (
                    <div style={{
                      width: '300px',
                      height: '200px',
                      border: '2px dashed #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      <label htmlFor="inputImg" className="flex items-center space-x-1 cursor-pointer"> <IoIosCamera size={26} /> <span>Image preview (Max:2Mo)</span></label>
                    </div>)}
              </label>
              <div>
                {produitInput.error_list && (
                  <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.image}</span>
                )}
              </div>
            </div>
            <div className='form-group col-md-6'>
              <div className="flex items-center gap-3 mt-3">
                <div>
                  <label htmlFor="selc" className='text-textG'>Categorie</label>
                  <select name="categorie_id" htmlFor="selc" className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" onChange={handleInput} value={produitInput.categorie_id}>
                    <option value={0}>...</option>
                    {
                      categoryList.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>{item.nom_categorie}</option>
                        )
                      })
                    }
                  </select>
                  {produitInput.error_list && (
                    <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.categorie_id}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="NomCat" className='text-textG'>Nom</label>
                  <input
                    onChange={handleInput} value={produitInput.nom_produit}
                    type="text"
                    name='nom_produit'
                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    id="prix_original"
                    placeholder="Nom"
                  />
                  {produitInput.error_list && (
                    <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.nom_produit}</span>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="NomCat" className='text-textG'>Marque</label>
                <input
                  onChange={handleInput} value={produitInput.marque_produit}
                  type="text"
                  className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                  placeholder="Marque"
                  name="marque_produit"
                />
                {produitInput.error_list && (
                  <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.marque_produit}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label text-textG">Description</label>
                <textarea className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" id="exampleFormControlTextarea1" name="description_produit" onChange={handleInput} value={produitInput.description_produit} rows="3"></textarea>
              </div>

              <div className="input-group mb-3">
                {/* <label className="input-group-text" for="inputGroupFile01">Image</label> */}
                <input type="file" onChange={handleImageChange} className="relative hidden w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" id="inputImg" />
              </div>
            </div>

          </div>

          <div className="flex items-start justify-between mt-6">
            <div>
              <p className='text-textG text-xl'>Détail en vente</p>
            </div>
            <div className='form-group col-md-6'>
              <div className="mt-3">
                <div>
                  <label htmlFor="prix_original" className='text-textG'>Prix</label>
                  <input
                    onChange={handleInput} value={produitInput.prix_original}
                    type="number"
                    name='prix_original'
                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    id="prix_original"
                    placeholder="Prix"
                  />
                  {produitInput.error_list && (
                    <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.prix_original}</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="stock" className='text-textG'>Quantité en stock</label>
                <input
                  onChange={handleInput} value={produitInput.stock}
                  type="number"
                  name='stock'
                  className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                  id="stock"
                  placeholder="Stock"
                />
                {produitInput.error_list && (
                  <span className='text-red-600 text-sm mt-1'>{produitInput.error_list.stock}</span>
                )}
              </div>
            </div>

          </div>
          <div className="flex items-center justify-end mt-4">
            <button type="submit" className="btn btn-primary">
              {load == 'on' ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Enregistrer</span>}
            </button>
          </div>

        </form>
      </div >
    </div >
  )
}

export default AddProduits

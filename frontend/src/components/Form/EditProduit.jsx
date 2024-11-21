import React, { useState, useEffect } from 'react'
import axiosClient from '../../axios-client';
import swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";

function EditProduit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produitInput, setProduit] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [load, setLoad] = useState('off');
  const [loader, setLoader] = useState(false);
  const [error_list, setErrorList ] = useState([])

  useEffect(() => {
    setLoader(true);
    axiosClient.get(`/edit-product/${id}`).then(res => {
      if (res.data.status === 200) {
        setProduit(res.data.product);
        setImage(`http://localhost:8000/${res.data.product.image}`);
      } else if (res.data.status === 404) {
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message
        });
        navigate('/Produits/List');
      }
      setLoader(false);
    });
  }, [id, navigate]);

  useEffect(() => {
    axiosClient.get('/all-category').then(res => {
      if (res.status === 200) {
        setCategoryList(res.data.category);
      }
    });
  }, []);

  const handleInput = (e) => {
    setProduit({ ...produitInput, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoad('on');

    const formData = new FormData();
    formData.append('categorie_id', produitInput.categorie_id);
    formData.append('nom_produit', produitInput.nom_produit);
    formData.append('marque_produit', produitInput.marque_produit);
    formData.append('description_produit', produitInput.description_produit);
    formData.append('prix_original', produitInput.prix_original);
    formData.append('prix', produitInput.prix);
    formData.append('stock', produitInput.stock);
    if (picture) {
      formData.append('image', picture);
    }

    axiosClient.post(`/update-product/${id}`, formData).then(res => {
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
        navigate('/Produits/List Produits');
      } else if (res.data.status === 422) {
        setErrorList(res.data.errors)
      } else if (res.data.status === 404) {
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message
        });
        navigate('/Produits/List Produits');
      }
      setLoad('off');
    });
  };

  return (
    <div className="mt-[12px]">
      <div className="car animated fadeInDown p-5">
        <div>
          <h3 className="text-gray-400 font-medium" >Modification d'un Produit</h3>
          <p className='text-textG text-sm' >Produits/Modification</p>
        </div>
        {loader &&
          <div className='text-center text-white'>
            Chargement...
          </div>
        }
        {!loader && <form onSubmit={handleSubmit} className='p-4' id='CATEGORY_FORM'>
          <div className="flex items-center justify-between">

            <div>
              <p className='text-textG text-xl'>Détail d'un produit</p>
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
                    Image preview (300x200)
                  </div>)}
            </div>
            <div className='form-group col-md-6'>
              <div className="flex items-center gap-3 mt-3">
                <div>
                  <label for="selc" className='text-textG'>Categorie</label>
                  <select name="categorie_id" for="selc" className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" onChange={handleInput} value={produitInput.categorie_id}>
                    <option selected>...</option>
                    {
                      categoryList.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>{item.nom_categorie}</option>
                        )
                      })
                    }
                  </select>
                  {error_list && (
                    <span className='text-red-600 text-sm mt-1'>{error_list.categorie_id}</span>
                  )}
                </div>

                <div>
                  <label for="NomCat" className='text-textG'>Nom</label>
                  <input
                    onChange={handleInput} value={produitInput.nom_produit}
                    type="text"
                    name='nom_produit'
                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    id="prix_original"
                    placeholder="Nom"
                  />
                  {error_list && (
                    <span className='text-red-600 text-sm mt-1'>{error_list.nom_produit}</span>
                  )}
                </div>
              </div>
              <div>
                <label for="NomCat" className='text-textG'>Marque</label>
                <input
                  onChange={handleInput} value={produitInput.marque_produit}
                  type="text"
                  className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                  placeholder="Marque"
                  name="marque_produit"
                />
                {error_list && (
                  <span className='text-red-600 text-sm mt-1'>{error_list.marque_produit}</span>
                )}
              </div>
              <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label text-textG">Description</label>
                <textarea className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" id="exampleFormControlTextarea1" name="description_produit" onChange={handleInput} value={produitInput.description_produit} rows="3"></textarea>
              </div>

              <div className="input-group mb-3">
                {/* <label className="input-group-text" for="inputGroupFile01">Image</label> */}
                <input type="file" onChange={handleImageChange} className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950" id="inputGroupFile01" />
              </div>
            </div>

          </div>

          <div className="flex items-start justify-between mt-6">
            <div>
              <p className='text-textG text-xl'>Détail en vente</p>
            </div>
            <div className='form-group col-md-6'>
              <div className="flex items-center gap-3 mt-3">
                <div>
                  <label for="prix_original" className='text-textG'>Prix d'origine</label>
                  <input
                    onChange={handleInput} value={produitInput.prix_original}
                    type="number"
                    name='prix_original'
                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    id="prix_original"
                    placeholder="Prix"
                  />
                  {error_list && (
                    <span className='text-red-600 text-sm mt-1'>{error_list.prix_original}</span>
                  )}
                </div>

                <div>
                  <label for="prix" className='text-textG'>Prix de vente</label>
                  <input
                    onChange={handleInput} value={produitInput.prix}
                    type="number"
                    name='prix'
                    className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                    id="prix"
                    placeholder="Prix"
                  />
                  {error_list && (
                    <span className='text-red-600 text-sm mt-1'>{error_list.prix}</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <label for="stock" className='text-textG'>Quantité en stock</label>
                <input
                  onChange={handleInput} value={produitInput.stock}
                  type="number"
                  name='stock'
                  className="relative block w-full shadow-sm shadow-black appearance-none rounded-lg px-3 py-[10px] text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-primary border-3 border-teal-950"
                  id="stock"
                  placeholder="Stock"
                />
                {error_list && (
                  <span className='text-red-600 text-sm mt-1'>{error_list.stock}</span>
                )}
              </div>
            </div>

          </div>
          <div className="flex items-center justify-end mt-4">
            <button type="submit" className="btn btn-primary">
              {load == 'on' ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Enregistrer</span>}
            </button>
          </div>

        </form>
        }

      </div >
    </div >
  )
}

export default EditProduit

import React, { useEffect, useRef, useState } from "react";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import axiosClient from "../axios-client";
import swal from "sweetalert2";
import { FiDownload } from "react-icons/fi";
import { RiMailSendLine } from "react-icons/ri";
import Spinner from 'react-bootstrap/Spinner';

const Facture = () => {
  const location = useLocation();
  const { client, vente, produits } = location.state || {};

  const [infoCli, setInfoCli] = useState({});
  const [infoPro, setInfoPro] = useState([]);
  const [idVente, setIdVente] = useState('');

  const [load, setLoad] = useState('off');

  useEffect(() => {
    if (vente && vente.client) {
      getCli(vente.client);
      axiosClient.get('/getIdMax').then(res => {
        if (res.status === 200) {
          setIdVente(res.data.venteId);
          console.log(idVente);
        }
      });
    }
    if (produits && produits.length > 0) {
      loadProductDetails();
    }
  }, [vente, produits]);

 
  const getCli = (id) => {
    setLoad('on')
    axiosClient.get(`/get-client/${id}`).then((res) => {
      if (res.data.status === 200) {
        setInfoCli(res.data.client);
      } else if (res.data.status === 404) {
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message,
        });
      }
      setLoad('off')
    });
  };
  const loadProductDetails = () => {
    const productPromises = produits.map((p) =>
      axiosClient.get(`/get-produit/${p.produit}`).then((res) => {
        if (res.data.status === 200) {
          return { ...p, ...res.data.product };
        } else {
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Erreur lors du chargement du produit avec ID ${p.produit}`,
          });
          return null;
        }
      })
    );

    Promise.all(productPromises).then((loadedProducts) => {
      setInfoPro(loadedProducts.filter((p) => p !== null)); 
    });
  };

  const invoiceData = {
    companyInfo: {
      name: "Ma Société",
      address: "123 Rue de la Paix, Paris",
      email: "contact@masociete.com",
    },
    customerInfo: {
      name: infoCli.nom,
      email: infoCli.tel,
    },
    invoiceDetails: {
      number: idVente ? 'INV-' + idVente : 'INV-0000',
      date: vente ? vente.date : new Date().toISOString().substring(0, 10),
    },
    items: infoPro.map((p) => ({
      description: p.category.nom_categorie + " " + p.nom_produit, 
      quantity: p.quantite,
      unitPrice: p.prix,
    })),
    total: vente ? vente.montant_total : 0,
  };

  const invoiceRef = useRef();

  // const Print = () => {
  //   const element = invoiceRef.current;
  //   const printWindow = window.open('', '_blank', 'width=800,height=600');

  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Facture</title>
  //         <style>
  //           /* Ajouter ici les styles spécifiques à la facture si nécessaire */
  //           body {
  //             font-family: Poppins, sans-serif;
  //             margin: 20px;
  //           }
  //           table {
  //             width: 100%;
  //             border-collapse: collapse;
  //           }
  //           table, th, td {
  //             border: 1px solid black;
  //           }
  //           th, td {
  //             padding: 10px;
  //             text-align: left;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${element.outerHTML}
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // };


  const generatePDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.05,
      filename: `facture_${invoiceData.customerInfo.name}.pdf`,
      image: { type: "jpeg", quality: 0.90 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
  };

  const generatePDFMail = (recipientEmail) => {
    setLoad("on")
    const element = invoiceRef.current;
    const options = {
      margin: 0.05,
      filename: `facture_hhhhjj.pdf`,
      image: { type: "jpeg", quality: 0.90 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    };


    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get('pdf')
      .then((pdf) => {

        const pdfBlob = pdf.output('blob');


        const formData = new FormData();
        formData.append('file', pdfBlob, `facture_mamitina.pdf`);
        formData.append('email', recipientEmail);


        axiosClient.post('/send-invoice', formData)
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              const Toast = swal.mixin({
                toast: true,
                position: "top-end",
                background: "#333",
                color: "white",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = swal.stopTimer;
                  toast.onmouseleave = swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Facture envoyée avec succès",
              });
              setLoad("off")
            }
          })
          .catch(error => {
            console.error(error);
            swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l\'envoi de la facture.',
            });
            setLoad("off")
          });

      });
  };

  const sendEmail = async () => {
    const { value: email } = await swal.fire({
      title: "Envoyer la facture",
      input: "email",
      inputLabel: "Adresse e-mail du destinataire",
      inputPlaceholder: "Entrez l'email",
      inputValidator: (value) => {
        if (!value) {
          return "Veuillez entrer un email valide";
        }
      },
    });
  
    if (email) {
      generatePDFMail(email);
    }
  };
  


  return (
    <>
      {load == 'on' ? (
        <div className="bg-gray-500 h-screen flex items-center justify-center">
          <Spinner animation="grow" variant="light" />
        </div >
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className=" bg-slate-100 shadow p-4 sticky top-0 z-10 animated fadeInDown flex items-center justify-between mb-2">
            <h1 className="text-3xl mb-6">Facture</h1>
            <div className="flex items-center space-x-2">
              <button onClick={sendEmail} type="button" className="btn btn-success btn-lg btn-block d-flex align-items-center gap-2">
                <RiMailSendLine />
                <span>Envoyer en Mail</span>
              </button>
              <button onClick={generatePDF} type="button" className="btn btn-primary btn-lg btn-block d-flex align-items-center gap-2">
                <FiDownload />
                <span>Exporter en PDF</span>
              </button>
            </div>

          </div>

          <div ref={invoiceRef} className="animated fadeInDown">
            <InvoiceTemplate invoiceData={invoiceData} />
          </div>

        </div>
      )
      }



    </>
  );
};

export default Facture;

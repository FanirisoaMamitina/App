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
  const { venteId, factureId, client, totalAmount, vente ,date} = location.state || {};


  const [idFacture, setIdFacture] = useState('');
  const [infoCli, setInfoCli] = useState({});
  const [infoPro, setInfoPro] = useState([]);
  const [idVente, setIdVente] = useState('');


  const [load, setLoad] = useState('off');

  const invoiceData = {
    companyInfo: {
      name: "Computer Store",
      address: "Ampasambazaha 301 Fianarantsoa",
      tel: "034 06 261 75",
      email: "computerstore.net1@gmail.com",
    },
    customerInfo: {
     id: vente.clients.id ? vente.clients.id : "inconnu",
      name: client.nom,
      tel: client.tel,
    },
    invoiceDetails: {
      number: factureId ? factureId : 'FA0000-0000',
      date: date ? date : new Date().toISOString().substring(0, 10),
    },
    items: vente && vente.detaille__vente ? vente.detaille__vente.map((p) => ({
      description: `${p.produits.category.nom_categorie} ${p.produits.nom_produit}`,
      quantity: p.quantite,
      unitPrice: p.prix_unitaire,
      total: (parseFloat(p.prix_unitaire) * p.quantite).toFixed(2),
    })) : [],
    paiements: vente.paiements,
    total: totalAmount ? totalAmount : 0,
    reste: vente.MontantRestant ? vente.MontantRestant : 0,
    payer: totalAmount - vente.MontantRestant,
  };

  const invoiceRef = useRef();


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

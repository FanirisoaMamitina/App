import React, { useEffect, useState } from "react";
import logo from "../assets/image/logo.jpg";
import n2words from "n2words";

const InvoiceTemplate = ({ invoiceData }) => {
  const { companyInfo, customerInfo, invoiceDetails, items, total, reste, paiements, description } = invoiceData;


  const formattedTotal = parseFloat(total) || 0;
  const formattedReste = parseFloat(reste) || 0;
  let payer = (total - reste) || 0
  const formatPayer = parseFloat(payer)
  const [words, setWords] = useState("");
  useEffect(() => {
    const result = n2words(formattedTotal, { lang: "fr" });
    setWords(result)
  }, [total])

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src={logo} alt="Logo de la société" className="h-28 mr-4" />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">Facture {invoiceDetails.number}</h2>
          <p>Date facturation : {new Date(invoiceDetails.date).toLocaleString()}</p>
          <p>Code client : {customerInfo.id}</p>
        </div>
      </header>

      <section className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] mb-2">Emmetteur :</h3>
          <div className="px-4 py-2 bg-gray-200 w-[330px] h-[180px]">
            <h3 className="text-[16px] font-semibold">{companyInfo.name}</h3>
            <p>{companyInfo.address}</p>
            <p>{companyInfo.tel}</p>
            <p>{companyInfo.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[16px] mb-2">Adressé à :</h3>
          <div className="px-4 py-2 border-1 border-gray-600 w-[330px] h-[180px]">
            <h3 className="text-[16px] font-semibold">Client Informatique Fianar</h3>
            <p>
              <span >{customerInfo.name}</span>
            </p>
            <p>
              <span>{customerInfo.tel}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-2  px-2 pb-2">
        {description &&
          <div className="px-4 py-2 border-1 border-gray-600 w-full h-[120px]">
            <p>
              <span>{description}</span>
            </p>
          </div>
        }

      </section>

      <table className="w-full mb-8 table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-black">Designation</th>
            <th className="border px-4 py-2 text-black">TVA</th>
            <th className="border px-4 py-2 text-black">P.U HT</th>
            <th className="border px-4 py-2 text-black">Qté</th>
            <th className="border px-4 py-2 text-black">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-8 py-2 text-gray-950">{item.description}</td>
                <td className="border px-4 py-2 text-gray-950">0%</td> {/* TVA 20% par exemple */}
                <td className="border px-4 py-2 text-gray-950">{parseFloat(item.unitPrice).toFixed(2)}</td>
                <td className="border px-4 py-2 text-gray-950">{item.quantity}</td>
                <td className="border px-4 py-2 text-gray-950">{item.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border px-4 py-2 text-center text-gray-500">
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer >
        <div className="flex items-start justify-between">
          <div>

          </div>
          <div>
            <h3 className="text-[16px] flex items-center justify-between"><span>Total HT: </span> <span>{formattedTotal.toFixed(2)} Ar</span></h3>
            <h3 className="text-[16px] flex items-center justify-between"><span>Total TTC: </span> <span>{formattedTotal.toFixed(2)} Ar</span></h3>
            <h3 className="text-[16px] flex items-center justify-between"><span>Payé: </span> <span>{formatPayer.toFixed(2)} Ar</span></h3>
            <h3 className="text-[16px] flex items-center justify-between"><span>Reste à payer:</span> <span> {"  " + formattedReste.toFixed(2)} Ar</span></h3>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <table className="w-8 max-h-5 table-auto border-collaps">
            <thead>
              <tr>
                <th className="border px-4 text-gray-950">Reglement</th>
                <th className="border px-4 text-gray-950">Montant</th>
                <th className="border px-4 text-gray-950">Type</th>
                <th className="border px-4 text-gray-950">Reference</th>
              </tr>
            </thead>
            <tbody>
              {paiements && paiements.length > 0 ? (
                paiements.map((payment, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-gray-950">{payment.DatePaiement}</td>
                    <td className="border px-4 py-2 text-gray-950">{parseFloat(payment.MontantPaye).toFixed(2)} Ar</td>
                    <td className="border px-4 py-2 text-gray-950">{payment.ModePaiement}</td>
                    <td className="border px-4 py-2 text-gray-950">{payment.Ref || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                    Aucun paiement disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </footer>

      <div className="text-right mt-16">
        <p>Arret de la Facture de somme de {words} Ariary</p>
      </div>

    </div>
  );
};

export default InvoiceTemplate;

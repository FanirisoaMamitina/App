import React from "react";
import logo from "../assets/image/logo.png";

const InvoiceTemplate = ({ invoiceData }) => {
  const { companyInfo, customerInfo, invoiceDetails, items, total } = invoiceData;

  // Convertir le total en nombre avant d'utiliser .toFixed
  const formattedTotal = parseFloat(total) || 0;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src={logo} alt="Logo de la société" className="h-12 mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Computer</h1>
            <span className="text-red-500 text-2xl font-semibold">Store</span>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">Facture {companyInfo.name}</h2>
          <p>Date facturation : {companyInfo.address}</p>
          <p>Code client : {companyInfo.email}</p>
        </div>
      </header>

      <section className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] mb-2">Emmetteur :</h3>
          <div className="px-4 py-2 bg-gray-200 w-[330px] h-[180px]">
            <h3 className="text-[16px] font-semibold">Computer Store</h3>
            <p>Ampasambazaha 301 Fianarantsoa</p>
            <p>034 06 261 75</p>
            <p>computerstore.net1@gmail.com</p>
          </div>
        </div>
        <div>
          <h3 className="text-[16px] mb-2">Adressé à :</h3>
          <div className="px-4 py-2 border-1 border-gray-600 w-[330px] h-[180px]">
            <h3 className="text-[16px] font-semibold">Client Informatique Fianar</h3>
            <p>
              <span >Mr Mamitina</span>
            </p>
            <p>
              <span>034 12 134 07</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-2  px-2 pb-2">
        <div className="flex items-center space-x-2">

        </div>

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
                <td className="border px-4 py-2 text-gray-950">{item.quantity}</td>
                <td className="border px-4 py-2 text-gray-950">{item.quantity}</td>
                <td className="border px-4 py-2 text-gray-950">{parseFloat(item.unitPrice).toFixed(2)}</td>
                <td className="border px-4 py-2 text-gray-950">{(item.quantity * item.unitPrice).toFixed(2)}</td>
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
            <h3 className="text-[16px] flex items-center justify-between"><span>Payé: </span> <span>{formattedTotal.toFixed(2)} Ar</span></h3>
            <h3 className="text-[16px] flex items-center justify-between"><span>Reste à payer:</span> <span>{formattedTotal.toFixed(2)} Ar</span></h3>
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
              <tr>
                <td className="border px-4">11/12/24</td>
                <td className="border px-4">2000000</td>
                <td className="border px-4">Espece</td>
                <td className="border px-4">REF123</td>
              </tr>
            </tbody>
          </table>
        </div>


      </footer>

      <div className="text-right mt-16">
        <p>Arret de la Facture de somme de </p>
      </div>

    </div>
  );
};

export default InvoiceTemplate;

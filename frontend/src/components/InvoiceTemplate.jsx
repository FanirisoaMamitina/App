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
          <img src={logo} alt="Logo de la société" className="h-16 mr-4" />
          <div>
            <h1 className="text-3xl font-bold">Computer</h1>
            <span className="text-red-500 text-3xl font-semibold">Store</span>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">{companyInfo.name}</h2>
          <p>{companyInfo.address}</p>
          <p>{companyInfo.email}</p>
        </div>
      </header>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Bill To:</h3>
        <p>{customerInfo.name}</p>
        <p>{customerInfo.address}</p>
        <p>{customerInfo.email}</p>
      </section>

      <section className="mb-8">
        <p>
          <span className="font-semibold">Invoice Number:</span> {invoiceDetails.number}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {invoiceDetails.date}
        </p>
      </section>

      <table className="w-full mb-8 table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-black">Description</th>
            <th className="border px-4 py-2 text-black">Quantity</th>
            <th className="border px-4 py-2 text-black">Unit Price</th>
            <th className="border px-4 py-2 text-black">Total</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2 text-gray-950">{item.description}</td>
                <td className="border px-4 py-2 text-gray-950">{item.quantity}</td>
                <td className="border px-4 py-2 text-gray-950">{parseFloat(item.unitPrice).toFixed(2)}</td>
                <td className="border px-4 py-2 text-gray-950">{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer className="text-right">
        <h3 className="text-2xl font-bold">Total: {formattedTotal.toFixed(2)} Ar</h3>
      </footer>
    </div>
  );
};

export default InvoiceTemplate;

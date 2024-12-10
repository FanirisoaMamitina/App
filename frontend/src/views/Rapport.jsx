import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Line } from 'react-chartjs-2';
import axiosClient from '../axios-client';
import * as XLSX from 'xlsx';


function RapportBenefice() {
    const [type, setType] = useState('journalier'); // Type par défaut
    const [benefices, setBenefices] = useState([]);

    const fetchBenefices = (type) => {
        axiosClient.get(`/benefices?type=${type}`).then((res) => {
            if (res.data.status === 200) {
                setBenefices(res.data.data);
            }
        });
    };

    useEffect(() => {
        fetchBenefices(type);
    }, [type]);

    const formattedData = benefices.map((item) => {
        if (type === 'journalier') return { label: item.date_jour, benefice: item.benefice };
        if (type === 'mensuel') return { label: `${item.annee}-${String(item.mois).padStart(2, '0')}`, benefice: item.benefice };
        if (type === 'annuel') return { label: item.annee, benefice: item.benefice };
        return {};
    });

    const chartData = {
        labels: formattedData.map((item) => item.label),
        datasets: [
            {
                label: 'Bénéfice (Ar)',
                data: formattedData.map((item) => item.benefice),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };



    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.text(`Rapport de Bénéfice (${type.charAt(0).toUpperCase() + type.slice(1)})`, 10, 10);

        const columns = [
            { header: type === 'journalier' ? 'Date' : type === 'mensuel' ? 'Mois' : 'Année', dataKey: 'label' },
            { header: 'Bénéfice (Ar)', dataKey: 'benefice' },
        ];
        const rows = formattedData.map((item) => ({
            label: item.label,
            benefice: Number(item.benefice).toLocaleString(),
        }));

        doc.autoTable({
            columns,
            body: rows,
            startY: 20,
        });

        doc.save(`Rapport_Benefice_${type}.pdf`);
    };


    const exportToExcel = () => {
        const data = formattedData.map((item) => ({
            [type === 'journalier' ? 'Date' : type === 'mensuel' ? 'Mois' : 'Année']: item.label,
            'Bénéfice (Ar)': Number(item.benefice),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');

        XLSX.writeFile(workbook, `Rapport_Benefice_${type}.xlsx`);
    };



    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Rapport des Bénéfices</h1>

            {/* Bouton de sélection */}
            <div className="mb-6 flex items-center justify-between">
                <select
                    className="p-2 bg-dark-second text-white rounded"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="journalier">Par Jour</option>
                    <option value="mensuel">Par Mois</option>
                    <option value="annuel">Par Année</option>
                </select>

                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={exportToPDF}
                    >
                        Exporter en PDF
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={exportToExcel}
                    >
                        Exporter en Excel
                    </button>
                </div>
            </div>

            {/* Tableau */}
            <table className="w-full text-white border-separate border-spacing-y-2 bg-dark-second rounded-lg mb-6 p-2">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-500">
                    <tr>
                        <th className="p-2 text-left">{type === 'journalier' ? 'Date' : type === 'mensuel' ? 'Mois' : 'Année'}</th>
                        <th className="p-2 text-left">Bénéfice (Ar)</th>
                    </tr>
                </thead>
                <tbody>
                    {formattedData.map((item, index) => (
                        <tr key={index} className="bg-dark-second px-2">
                            <td className="p-2">{item.label}</td>
                            <td className="p-2">{Number(item.benefice).toLocaleString()} Ar</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Graphique */}
            <div className="bg-dark-second p-6 rounded-lg w-full">
                <Line data={chartData} />
            </div>
        </div>
    );
}

export default RapportBenefice;

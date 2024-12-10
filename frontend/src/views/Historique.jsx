// components/HistoriqueActions.js
import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaPlus, FaDatabase } from 'react-icons/fa';
import axiosClient from '../axios-client';

function Historique() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIn , setUser] = useState('');

  useEffect(() => {
    axiosClient.get('/historique-actions')
      .then(response => {
        setHistorique(response.data.historique);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement de l'historique", error);
        setLoading(false);
      });

    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data)
      })
  }, []);

  const getIcon = (action) => {
    switch (action) {
      case 'ajout':
        return <FaPlus className="text-green-400" />;
      case 'modification':
        return <FaEdit className="text-yellow-400" />;
      case 'suppression':
        return <FaTrash className="text-red-400" />;
      default:
        return <FaDatabase className="text-blue-400" />;
    }
  };

  const renderDetailsAsList = (details) => {
    if (typeof details === 'object' && details !== null) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(details).map(([key, value]) => (
                <tr key={key}>
                  <td className="font-semibold text-gray-300 pr-4">{key}</td>
                  <td className="text-gray-100">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <span>{details || 'Aucun détail'}</span>;
    }
  };




  return (
    <div className="car animated fadeInDown">
      <h2 className="text-2xl font-semibold mb-6 text-textG">Historique des actions</h2>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-500">
            <tr>
              <th className=" text-left text-gray-300">Action</th>
              <th className=" text-left text-gray-300">Table</th>
              <th className=" text-left text-gray-300">ID de l'élément</th>
              <th className=" text-left text-gray-300">Détails</th>
              <th className=" text-left text-gray-300">utilisateur</th>
              <th className=" text-left text-gray-300">Date</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="7" class="text-center">
                  Chargement...
                </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody className="text-gray-400 animated fadeInDown">
              {historique.map((action, index) => (
                <tr key={index} className="hover:bg-gray-800 transition">
                  <td className="flex items-center space-x-2">
                    {getIcon(action.action)}
                    <span className="capitalize">{action.action}</span>
                  </td>
                  <td>{action.table}</td>
                  <td>{action.element_id}</td>
                  <td>{renderDetailsAsList(action.details)}</td>
                  <td>{action.user ? (action.user.name === userIn.name ? "Vous" : action.user.name ) : 'Utilisateur inconnu'}</td>
                  <td>
                    {new Date(action.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  );
}

export default Historique;

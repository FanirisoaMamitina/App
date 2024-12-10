import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import CountUp from 'react-countup';
import axiosClient from '../axios-client';
import { FaDollarSign, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [totalVentes, setTotalVentes] = useState(0);
  const [nombreClients, setNombreClients] = useState(0);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [produitsFaibleStock, setProduitsFaibleStock] = useState([]);
  const [ventesParCategorie, setVentesParCategorie] = useState([]);
  const [ventesEvolution, setVentesEvolution] = useState([]); // Assurez-vous que ces données sont correctement formatées
  const [produitsLesPlusVendus, setProduitsLesPlusVendus] = useState([]);
  const [historiqueVentes, setHistoriqueVentes] = useState([]);

  useEffect(() => {
    // Charger les données de vente
    axiosClient.get('/stats-ventes').then(({ data }) => {
      setTotalVentes(data.totalVentes);
      setNombreClients(data.nombreClients);
      setBeneficeTotal(data.beneficeTotal);
      setProduitsFaibleStock(data.produitsFaibleStock);
      setVentesParCategorie(data.ventesParCategorie);
      setVentesEvolution(data.ventesEvolution); // Ajouter les données pour le graphique linéaire
      setProduitsLesPlusVendus(data.produitsLesPlusVendus);
    });

    axiosClient.get('/historique-ventes').then(({ data }) => {
      setHistoriqueVentes(data.ventes);
    });
  }, []);

  const renderFaibleStock = () => (
    <ul>
      {produitsFaibleStock.map((produit) => (
        <li key={produit.id}>
          {produit.nom_produit} - Stock : <CountUp start={0} end={produit.stock} duration={4} />
        </li>
      ))}
    </ul>
  );

  const renderProduitsLesPlusVendus = () => (
    <table className="min-w-full bg-[#1B1B1B] border border-gray-700 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-700">
          <th className="border-b border-gray-700 text-gray-300">Nom du Produit</th>
          <th className="border-b border-gray-700 text-gray-300">Description</th>
          <th className="border-b border-gray-700 text-gray-300">Ventes</th>
        </tr>
      </thead>
      <tbody>
        {produitsLesPlusVendus.map((produit) => (
          <tr key={produit.produit_id} className="hover:bg-gray-800">
            <td className="border-b border-gray-700 text-gray-400">{produit.produits.nom_produit}</td>
            <td className="border-b border-gray-700 text-gray-400">{produit.produits.description_produit}</td>
            <td className="border-b border-gray-700 text-gray-400">{produit.total_vendus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container-fluid mx-auto p-4">
      <h1 className="text-3xl font-bold text-textG mb-4">Tableau de Bord</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={animationVariants}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Cartes des statistiques */}
        <div className="bg-gradient-to-t from-indigo-700 to-indigo-500 text-white p-4 rounded-lg shadow flex items-center space-x-4">
          <div className='bg-transparent p-2 rounded-md shadow-md border-3 border-indigo-500'>
            <FaDollarSign size={30} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Total des Ventes</h2>
            <p className="text-2xl"> <CountUp start={0} end={totalVentes} separator=' ' decimals={2} /> Ar</p>
          </div>
        </div>
        <div className="bg-gradient-to-t from-green-700 to-green-500 text-white p-4 rounded-lg shadow flex items-center space-x-4">
          <div className='bg-transparent p-2 rounded-md shadow-md border-3 border-green-500'>
            <FaUsers size={30} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Nombre de Clients</h2>
            <p className="text-2xl"> <CountUp start={0} end={nombreClients} duration={3} /></p>
          </div>
        </div>
        <div className="bg-gradient-to-t from-blue-700 to-blue-500 text-white p-4 rounded-lg shadow flex items-center space-x-4">
          <div className='bg-transparent p-2 rounded-md shadow-md border-3 border-blue-500'>
            <FaChartLine size={30} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Bénéfice Total</h2>
            <p className="text-2xl">  <CountUp start={0} end={beneficeTotal} separator=' ' decimals={2} /> Ar</p>
          </div>
        </div>
        <div className="bg-gradient-to-t from-red-700 to-red-500 text-white p-4 rounded-lg shadow flex items-center space-x-4 relative">
          <div className='bg-transparent p-2 rounded-md shadow-md border-3 border-red-500'>
            <FaExclamationTriangle size={30} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Produits Faible Stock</h2>
            {/* Affichage du premier produit avec le nombre supplémentaire si applicable */}
            {produitsFaibleStock.length > 0 && (
              <p>{produitsFaibleStock[0].nom_produit} - Stock : {produitsFaibleStock[0].stock}</p>
            )}
          </div>

          {/* Badge */}
          {produitsFaibleStock.length > 1 && (
            <span className="absolute top-[65px] right-[50px] bg-red-700 text-white text-sm font-bold px-2 py-1 rounded-full shadow-md border-2 border-red-500">
              +{produitsFaibleStock.length - 1}
            </span>
          )}
        </div>

      </motion.div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Ventes par Catégorie</h2>
          <Bar
            data={{
              labels: ventesParCategorie.map((item) => item.nom_categorie),
              datasets: [
                {
                  label: 'Ventes par Catégorie',
                  data: ventesParCategorie.map((item) => item.total),
                  backgroundColor: '#365CF5',
                  borderColor: 'transparent',
                  borderWidth: 1,
                  borderRadius: 5,
                  barThickness: 20,
                  maxBarThickness: 25,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  backgroundColor: '#F3F6F8',
                  titleColor: '#8F92A1',
                  titleFont: { size: 12 },
                  bodyColor: '#171717',
                  bodyFont: { weight: 'bold', size: 16 },
                  displayColors: false,
                  padding: { x: 30, y: 10 },
                  bodyAlign: 'center',
                  titleAlign: 'center',
                },
                legend: {
                  display: false,
                },
              },
              layout: {
                padding: { top: 0 },
              },
              scales: {
                y: {
                  grid: {
                    display: false,
                    drawTicks: false,
                    drawBorder: false,
                  },
                  ticks: {
                    padding: 35,
                    max: Math.max(...ventesParCategorie.map(item => item.total)) + 100,
                    min: 0,
                  },
                },
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                    color: 'rgba(143, 146, 161, .1)',
                    zeroLineColor: 'rgba(143, 146, 161, .1)',
                  },
                  ticks: {
                    padding: 20,
                  },
                },
              },
            }}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Produits les Plus Vendus</h2>
          <div className='mt-8 bg-[#1B1B1B] rounded-lg p-4'>
            {renderProduitsLesPlusVendus()}
          </div>
        </motion.div>
      </div>

      {/* Graphique Linéaire */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Évolution des Ventes</h2>
          <div className='w-[650px] h-[400px]'>
            <Line
              data={{
                labels: ventesEvolution.map((item) => item.date),
                datasets: [
                  {
                    label: 'Évolution des Ventes',
                    data: ventesEvolution.map((item) => item.total),
                    backgroundColor: 'transparent',
                    borderColor: '#365CF5',
                    borderWidth: 3, // Épaisseur réduite
                    pointRadius: 3, // Points plus petits
                    cubicInterpolationMode: 'monotone',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 500, // Durée de l'animation réduite
                },
                plugins: {
                  tooltip: {
                    backgroundColor: '#f9f9f9',
                    titleColor: '#8F92A1',
                    titleFont: { size: 12, family: 'Plus Jakarta Sans' },
                    bodyColor: '#171717',
                    bodyFont: { weight: 'bold', size: 14, family: 'Plus Jakarta Sans' },
                    displayColors: false,
                  },
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    grid: { display: false },
                    ticks: { padding: 35, max: 1200, min: 500 },
                  },
                  x: {
                    grid: {
                      drawBorder: false,
                      color: 'rgba(143, 146, 161, .1)',
                      zeroLineColor: 'rgba(143, 146, 161, .1)',
                    },
                    ticks: { padding: 20 },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-8 bg-[#1B1B1B] rounded-lg p-4"
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Historique des Ventes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1B1B1B] border border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-600">
                  <th className="border-b border-gray-700 text-gray-300">Date</th>
                  <th className="border-b border-gray-700 text-gray-300">Client</th>
                  <th className="border-b border-gray-700 text-gray-300">Produits</th>
                  <th className="border-b border-gray-700 text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {historiqueVentes.map((vente) => (
                  <tr key={vente.id} className="hover:bg-gray-800">
                    <td className="border-b border-gray-800 text-gray-400">
                      {new Date(vente.date).toLocaleDateString()} {/* Formater la date */}
                    </td>
                    <td className="border-b border-gray-800 text-gray-400">
                      {vente.clients?.nom || 'Non spécifié'} {/* Nom du client */}
                    </td>
                    <td className="border-b border-gray-800 text-gray-400">
                      {vente.detaille__vente.map((detail) => (
                        <div key={detail.id}>
                          {detail.produits?.nom_produit || 'Produit inconnu'} {" "}
                          <span className="font-bold">{detail.quantite} pcs </span>
                        </div>
                      ))}
                    </td>
                    <td className="border-b border-gray-800 text-gray-400">
                      {vente.montant_total.toLocaleString()} Ar {/* Montant total formaté */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-end mt-4">
              <Link to="/Vente/List Vente" className="bg-indigo-600 px-4 py-2 text-white rounded-md text-decoration-none hover:bg-indigo-800">
                Voir plus
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;

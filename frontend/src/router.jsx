import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Produits from "./views/Produits.jsx";
import Clients from "./views/Clients.jsx";
import Vente from "./views/Vente.jsx";
import Facture from "./views/Facture.jsx";
import Parametre from "./views/Parametre.jsx";
import Historique from "./views/Historique.jsx";
import Notifications from "./views/Notifications.jsx";
import AddProduits from "./components/Form/AddProduits.jsx";
import Categories from "./views/Categories.jsx";
import AddCategories from "./components/Form/AddCategories.jsx";
import EditCategories from "./components/Form/EditCategories.jsx";
import AddClients from "./components/Form/Clients/AddClients.jsx";
import EditClient from "./components/Form/Clients/EditClient.jsx";
import AddVente from "./components/Form/Vente/AddVente.jsx";
import DetailVente from "./views/DetailVente.jsx";
import EditProduit from "./components/Form/EditProduit.jsx";
import AddPaiement from "./components/Form/Paiement/AddPaiement.jsx";
import AddPaiementById from "./components/Form/Paiement/AddPaiementById.jsx";
import AddFacture from "./components/Form/Facture/AddFacture.jsx";
import PaiementList from "./views/PaiementList.jsx";
import DetailsClient from "./views/DetailsClient.jsx";
import RapportBenefice from "./views/Rapport.jsx";

const router = createBrowserRouter([
    {
        path:'/',
        element: <DefaultLayout />,
        children: [
            {
                path:'/',
                element: <Navigate to="/dashboard" />
            },
            {
                path:'/dashboard',
                element: <Dashboard />
            },
            {
                path:'/Produits/Liste Produits',
                element: <Produits />,
            },
            {
                path:'/Produits/Ajout Produits',
                element: <AddProduits />
            },
            {
                path:'/Produits/Edit Produit/:id',
                element: <EditProduit />
            },
            {
                path:'/Produits/Categories',
                element: <Categories />
            },
            {
                path:'/Produits/Ajout Categories',
                element: <AddCategories/>
            },
            {
                path: '/Produits/Edit Categories/:id',
                element: <EditCategories />
            },
            {
                path:'/Clients/Liste Clients',
                element: <Clients />
            },
            {
                path:'/Clients/Ajout Clients',
                element: <AddClients />
            },
            {
                path: '/Clients/Edit Client/:id',
                element: <EditClient />
            },
            {
                path: '/Clients/Details/:id',
                element: <DetailsClient />
            },
            {
                path:'/Vente/Liste Vente',
                element: <Vente />
            },
            {
                path:'/Vente/Details/:id',
                element: <DetailVente />
            },
            {
                path:'/Vente/Ajout Vente',
                element: <AddVente />
            },
            {
                path:'/paiement',
                element: <PaiementList />
            },
            {
                path:'/rapport',
                element: <RapportBenefice />
            },
            {
                path:'/Add Paiement',
                element: <AddPaiement />
            },
            {
                path:'/AddPaiement/:id',
                element: <AddPaiementById />
            },
            {
                path:'/Facture',
                element: <Facture />
            },
            {
                path:'/AddFacture',
                element: <AddFacture />
            },
            {
                path:'/notifications',
                element: <Notifications />
            },
            {
                path:'/historique',
                element: <Historique />
            },
            {
                path:'/parametres',
                element: <Parametre />
            },
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children: [
            {
                path:'/login',
                element: <Login />
            },
            {
                path:'/signup',
                element: <Signup />
            }
        ]
    }

])

export default router;
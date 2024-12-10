import React, { useState, useEffect } from 'react';
import echo from '../echo'; // Configuration Laravel Echo
import { BiBell } from 'react-icons/bi';

const NotificationsMenu = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Écouter les notifications en temps réel
        echo.channel('notifications')
            .listen('NotificationEvent', (data) => {
                setNotifications((prev) => [data, ...prev]); // Ajouter la nouvelle notification
                setUnreadCount((prev) => prev + 1); // Incrémenter le nombre de notifications non lues
            });

        return () => {
            echo.leaveChannel('notifications'); // Nettoyer l'écouteur
        };
    }, []);

    // Fonction pour marquer les notifications comme lues
    const markAllAsRead = () => {
        setUnreadCount(0); // Réinitialiser le compteur
    };

    return (
        <div>
            {/* Icône de notification avec compteur */}
            <div className="relative">
                <BiBell size={23} className="text-[#DEE1E2]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* Menu des notifications */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg">
                <div className="p-3 border-b flex justify-between items-center">
                    <span className="font-bold">Notifications</span>
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500"
                    >
                        Marquer tout comme lu
                    </button>
                </div>
                <ul className="max-h-64 overflow-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li
                                key={index}
                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() =>
                                    window.location.href = `/produit/${notification.product_id}`
                                }
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {notification.timestamp}
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 text-sm">
                            Pas de nouvelles notifications.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationsMenu;

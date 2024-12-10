import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
// Configuration Laravel Echo
const echo = new Echo({
    broadcaster: 'pusher',
    key: 'local-app-key',
    cluster: 'mt1',
    wsHost: window.location.hostname, 
    wsPort: 6001, 
    forceTLS: false, 
    disableStats: true, 
});

export default echo;

// Service Worker Unregister Script
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        if (registrations.length === 0) {
            console.log('No service workers to unregister');
            return;
        }

        return Promise.all(
            registrations.map(registration => 
                registration.unregister().then(unregistered => {
                    if (unregistered) {
                        console.log('ServiceWorker unregistered:', registration.scope);
                    } else {
                        console.log('ServiceWorker unregistration failed:', registration.scope);
                    }
                    return unregistered;
                })
            )
        );
    }).catch(function(error) {
        console.error('Error during service worker unregistration:', error);
    });
} else {
    console.log('Service workers are not supported in this browser');
}

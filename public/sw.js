


self.addEventListener('activate', async (e) => {
    // This will be called only once when the service worker is activated.
    console.log("Service worker registered >>>>>>>>>>>>>>>")
    try {
        const options = {
            userVisibleOnly: true,
            applicationServerKey: "BOo8l8ft6TnM6ic8E2fm_BKz1fwqoF9pQEk-9Z7ZIJhDjSvmtBz9oOTgVuO-pFUbB-roAIzYHVQtztlpCWO1it4"
        }
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(subscription)
        const response = await saveSubscription(subscription)
        console.log(response)
    } catch (err) {
        console.log('Error', err)
    }
})

const saveSubscription = async (subscription) => {
    const SERVER_URL = 'http://localhost:8080/s/save'
    const response = await fetch(SERVER_URL,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener('push', function (e) {
    var options = {
        body: 'This notification was generated from a push!',
        icon: 'images/example.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore', title: 'Explore this new world',
                icon: 'images/checkmark.png'
            },
            {
                action: 'close', title: 'Close',
                icon: 'images/xmark.png'
            },
        ]
    };

    e.waitUntil(
        self.registration.showNotification('Hello world!', options)
    );
})
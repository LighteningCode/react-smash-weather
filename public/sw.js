


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
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener('push', function (e) {

    if (e.data) {
        console.log("Push event!!", e.data.text())
        showLocalNotification("Hello", e.data.text(), self.registration)
    } else {
        console.log("No data")
    }
})


const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        ...body
    }
    swRegistration.showNotification(title, options)
}
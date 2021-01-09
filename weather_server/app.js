const path = require('path');
const express = require('express');
const bodyparser = require('body-parser')
const webpush = require('web-push')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyparser.json())

const port = process.env.PORT || 8080;

const publicPath = path.join(__dirname, '..', 'build');
app.use(express.static(publicPath));

// memory store
const dummyDb = { subscription: null }


const saveToDatabase = async subscription => {
   // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
   // Here you should be writing your db logic to save it.
   dummyDb.subscription = subscription
}

const vapidKeys = {
   publicKey: "BOo8l8ft6TnM6ic8E2fm_BKz1fwqoF9pQEk-9Z7ZIJhDjSvmtBz9oOTgVuO-pFUbB-roAIzYHVQtztlpCWO1it4",
   privateKey: "aZwBYugrZ7PSXEaXEvYQ7dtH4sZk4dfukTX-ynZCKkg"
}

app.post("/s/save", async (req, res, next) => {
   const subscription = req.body
   console.log(subscription)
   await saveToDatabase(subscription)
   res.status(200).json({ msg: "success" })
})

webpush.setVapidDetails("mailto:myuserid@email.com", vapidKeys.publicKey, vapidKeys.privateKey)

const sendNotification = (subscription, data) => {
   webpush.sendNotification(subscription, data)
}

app.get('/s/send', (req, res) => {
   const subscription = dummyDb.subscription //get subscription from your databse here.
   const message = 'Hello World'
   sendNotification(subscription, message)
   res.json({ message: 'message sent' })
})

app.get('/*', (req, res) => {
   // res.sendFile(path.join(publicPath, 'index.html'));
   res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});


app.listen(port, () => {
   console.log('Server is up!');
});
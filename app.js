const users = require('./routes/users')
const auth = require('./routes/auth')
const guests = require('./routes/guests')
const countryDetails = require('./routes/countryDetails')
const orderDetails = require('./routes/orderDetails')
const parcelPoints = require('./routes/parcelPoints')
const customInvoice = require('./routes/customInvoice')
const chats = require('./routes/chats')
const resetPassword = require('./routes/resetPassword')
const emailTriggers = require('./routes/emailTriggers')
const cmrs = require('./routes/cmrs')

const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express');
const { Chat } = require('./models/chat')
const socketAuth = require('./middleware/socketAuth')
const app = express()

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/order')//added heroku server connection variable for mongodb
    .then(() => console.log("server Connected to mongoDB..."))
    .catch(() => console.log("Could not connect to DB..."))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));

}

app.use(express.json({limit: '1mb'}))
app.use(cors())
app.use('/api/user', users)
app.use('/api/guest', guests)
app.use('/api/auth', auth)
app.use('/api/country', countryDetails)
app.use('/api/orderDetails', orderDetails)
app.use('/api/parcelPoints', parcelPoints)
app.use('/api/customInvoice', customInvoice)
app.use('/api/chat', chats)
app.use('/api/resetPassword', resetPassword)
app.use('/api/emailTriggers', emailTriggers)
app.use('/api/cmr', cmrs)

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
}

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    // path: '/'
    cors: {
        origin: '*'
    }
});
io.use(socketAuth)
io.on('connection', (socket) => {
    socket.on("disconnect", () => {
        console.log("Disconnected")
    })
    socket.on('chat', async (payload) => {
        const user = socket.handshake.user
        if (user.isAdmin) {
            payload.isAdmin = user.isAdmin
            payload.senderId = user._id
            const chat = await new Chat(payload)
            const newPayload = await chat.save()
            io.emit(payload.email, newPayload)
            io.emit('toAdmin', newPayload)
        } else {
            payload.isAdmin = user.isAdmin
            payload.customerId = user._id
            payload.senderId = user._id
            const chat = await new Chat(payload)
            const newPayload = await chat.save()
            io.emit('toAdmin', newPayload)
            io.emit(payload.email, newPayload)

        }
    })
})

// routes and io on connection
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log("Websocket started at port: ", port)
});



// const port = process.env.PORT || 3001;
// app.listen(port, () => console.log("server running on port: ", port))
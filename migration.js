const data = require("./data")
const oldClient = require("./models/oldClient")
const newClient = require("./models/newClient")
require("./config/database")

const seed = async () => {
    try {
        // drop the data from the database
        await newClient.deleteMany({})
        await oldClient.deleteMany({})

        // filter an array of new clients 
        let newClients = data.filter(client => client.stillClient)
        // filter an array of old clients
        let oldClients = data.filter(client => !client.stillClient)

        // map new clients to an array of pending promises
        newClients = newClients.map(client => newClient.create(client))
        // map old clients to an array of pending promises
        oldClients = oldClients.map(client => oldClient.create(client))

        console.log("new client database promises:", newClients)

        // use Promise.all to resolve each batch of promises
        await Promise.all(newClients)
        await Promise.all(oldClients)
    } catch (err) {
        console.log(err)
    }
}
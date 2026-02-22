const express = require("express")
const amqp = require("amqplib")

const app = express()
app.use(express.json())

let channel

async function connectQueue() {
    const connection = await amqp.connect("amqp://localhost")
    channel = await connection.createChannel()
    await channel.assertQueue('emailQueue')
}

connectQueue()

app.post("/send-email", async(req,res) => {
    const {email, message} = req.body
    channel.sendToQueue(
        "emailQueue",
        Buffer.from(JSON.stringify({email, message}))
    )
    res.json({
        message: "Email job created successfully"
    })
})

app.listen(3000, () => {
    console.log("Producer running on port 3000")
})


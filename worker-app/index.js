const amqp = require("amqplib")

async function startWorker() {

    const connection = await amqp.connect("amqp://localhost")
    const channel = await connection.createChannel()

    await channel.assertQueue("emailQueue")

    console.log("Worker waiting for messages...")
    
    channel.consume("emailQueue", async(msg) => {
        const data = JSON.parse(msg.content.toString())

        console.log("Sending Email to:",data.email)
        console.log("Message:", data.message)

        setTimeout(() => {
            console.log("Email sent successfully")
        }, 3000);
        
        channel.ack(msg)
        
    })
    
}

startWorker()
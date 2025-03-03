import app from "./server.js"

const port = 8001

app.listen(port, () => {
    console.log(`Server listening to port ${port}`)
})
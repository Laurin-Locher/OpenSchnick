import app from "./server.js"
import osDAO from "./dao/osDAO.js";

osDAO.initialize()

const port = 8000

app.listen(port, () => {
    console.log(`Server listening to port ${port}`)
})
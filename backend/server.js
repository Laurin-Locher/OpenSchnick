import router from "./api/os.route.js"
import express from "express"
import cors from "cors"

const app = express()

// Cross Origen Reccourse Sharing
app.use(cors({
    origin: "https://openschnickgame.onrender.com", 
    methods: ["GET", "POST"], 
    credentials: true
  }));

// automaticly transforms incoming json into a java-script object
app.use(express.json())

// router
app.use('/api/v1/os-game', router)

// when url is not found
app.use('*', (req, res) => res.status(404).json({ error: 'page not found'}))


export default app

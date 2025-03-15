import { json } from "express"
import osDAO from "../dao/osDAO.js"
import Judge from "./ai.js"

export default class OsController {
    static hosts = {}
    static guests = {}

    static async hostLobby(req, res, next) {
        const username = req.body.username

        const host = await osDAO.hostLobby("online", 1, username)

        switch (host.status) {
            case 'succes':
                res.json({ status: 'succes', id: host.id })
                return

            case 'failed':
                res.status(500).json({ status: 'failed' })
                return

            default:
                res.status(500).json({ status: 'failed' })
                return
        }
    }

    static async connectHost(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const id = req.params.id
        OsController.hosts[id] = res

        req.on('close', () => {
            delete OsController.hosts[id]
        });
    }

    static async connectGuest(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const id = req.params.id

        OsController.guests[id] = res

        req.on('close', () => {
            delete OsController.guests[id]
        });
    }

    static async startGame(req, res) {
        const id = req.params.id
        console.log('start game: ' + id)

        const startTime = Date.now() + 1000

        if (OsController.guests[id]) {
            OsController.guests[id].write(`data: ${JSON.stringify({ startTime: startTime })}\n\n`)
        } else {
            console.log('Guest not found ' + id)
        }

        res.json({ startTime: startTime })

    }

    static async joinLobby(req, res, next) {
        console.log('join game')
        const id = req.params.id
        const username = req.body.username

        const join = await osDAO.joinLobby(parseInt(id), username)
        const lobby = await osDAO.getLobby(id)

        if (OsController.hosts[id]) {
            OsController.hosts[id].write(`data: ${JSON.stringify(lobby)}\n\n`)
        } else {
            console.log('Host not found ' + id)
        }


        switch (join.status) {
            case 'succes':
                res.json(join)
                return
            case 'notFound':
                res.json({ status: 'id not found' })
                return
            case 'failed':
                res.status(500).json({ status: 'failed' })
                return

        }

    }

    static async logIn(req, res, user) {
        console.log(req.params)
        console.log(req.body)
        const id = req.params.id
        const word = req.body.word
  
        console.log(`${user} loggs in ${word} at ${id}`)

        const result = await osDAO.logInWord(id, word, user)

        switch (result.status) {
            case 'already logged in':
                console.log('already logged in')
                res.json({
                    status: 'already logged in'
                })
                return

            case 'succes':
                res.json(result)

                if (result.both === true) {
                    OsController.sendResults(id) // Fix: Pass the id to sendResults
                }
                return

            case 'failed':
                res.status(500).json({ status: 'failed', error: result.error })
                return
        }
    }

    static writeToHost(id, message) {
        if (OsController.hosts[id]) {
            OsController.hosts[id].write(`data: ${message}\n\n`)
        } else {
            console.log('Host not found ' + id)
        }
    }

    static writeToGuest(id, message) {
        if (OsController.guests[id]) {
            OsController.guests[id].write(`data: ${message}\n\n`)
        } else {
            console.log('Guest not found ' + id)
        }
    }

    static async logInHost(req, res) {
        OsController.logIn(req, res, 'host')
    }

    static async logInGuest(req, res) {
        OsController.logIn(req, res, 'guest')
    }

    static async sendResults(id) {
        const lobby = await osDAO.getLobby(id)

        OsController.writeToHost(id, lobby.guestWord)

        OsController.writeToGuest(id, lobby.hostWord)
        
        setTimeout(() => {
            const ai = new Judge()

            ai.ask(lobby.hostWord, lobby.guestWord, lobby.username, lobby.guestUsername, 'de', (chunk) => {
                OsController.writeToHost(id, chunk)
                OsController.writeToGuest(id, chunk)
            })
        }, 5000)

        
    }
}
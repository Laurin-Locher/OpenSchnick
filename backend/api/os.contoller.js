import { json } from "express"
import osDAO from "../dao/osDAO.js"

export default class OsController {
    static async hostLobby(req, res, next) {
        console.log('host game')

        const username = req.body.username

        const host = await osDAO.hostLobby("online", 1, username)

        switch(host.status) {
            case 'succes':
                res.json({ status: 'succes', id: host.id })
                return

            case 'failed':
                res.status(500).json({ status: 'failed' })
                return

            default:
                res.status(500).json({ status: 'failed'})
                return
        }
    }

    static async joinLobby(req, res, next) {
        console.log('join game')
        const id = req.params.id
        const username = req.body.username

        const join = await osDAO.joinLobby(parseInt(id), username)

        switch(join.status) {
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
}
import { json } from "express"
import osDAO from "../dao/osDAO.js"

export default class OsController {
    static hosts = {}

    static async hostLobby(req, res, next) {
        console.log('host game')

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

        console.log('id:' + id)
        OsController.hosts[id] = res

        req.on('close', () => {
            console.log('close connection: ' + id)
            delete OsController.hosts[id]
        });
    }

    static async joinLobby(req, res, next) {
        console.log('join game')
        const id = req.params.id
        const username = req.body.username

        const join = await osDAO.joinLobby(parseInt(id), username)
        const lobby = await osDAO.getLobby(id)
        OsController.hosts[id].write(`data: ${JSON.stringify(lobby)}\n\n`)

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
}
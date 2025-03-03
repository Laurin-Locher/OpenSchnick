export default class OsGameController {
    static async hostGame(req, res, next) {
        console.log('host game')

        res.json({ status: 'succes' })
    }

    static async joinGane(req, res, next) {
        console.log('join game')

        res.json({ status: 'succes' })
    }
}
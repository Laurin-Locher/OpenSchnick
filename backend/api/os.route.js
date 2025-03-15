import contoller from "./os.contoller.js";
import express from "express";

const router = express.Router()

/* Different methods for a http methods:
GET: get a reccource
POST: send data to the server - for example creating a new recourcce
PUT: updete or replace a reccource 
DELETE: delete a reccource
*/

router.route('/host').post(contoller.hostLobby)
router.route('/join/:id').post(contoller.joinLobby)

router.route('/connectHost/:id').get(contoller.connectHost)
router.route('/connectGuest/:id').get(contoller.connectGuest)

router.route('/start/:id').get(contoller.startGame)

router.route('/logInHost/:id').post(contoller.logInHost)
router.route('/logInGuest/:id').post(contoller.logInGuest)

export default router
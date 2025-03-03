import contoller from "./os-game.contoller.js";
import express from "express";

const router = express.Router()

/* Different methods for a http methods:
GET: get a reccource
POST: send data to the server - for example creating a new recourcce
PUT: updete or replace a reccource 
DELETE: delete a reccource
*/

router.route('/host/:id').post(contoller.hostGame)
router.route('/join/:id').post(contoller.joinGane)

export default router
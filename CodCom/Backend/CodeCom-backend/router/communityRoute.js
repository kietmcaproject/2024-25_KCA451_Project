import express from 'express';
import { createCommunity,  fetchCommunity,  getCreatedCommunity,  getJoinedCommunity, joinCommunity, getMessages , sendMessages} from '../controller/communityController.js';

import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/createCommunity',verifyToken,createCommunity)
router.post('/joinCommunity',verifyToken, joinCommunity)
router.get('/getJoinedCommunity',verifyToken,getJoinedCommunity)
router.get('/getCreatedCommunity',verifyToken,getCreatedCommunity)
router.get('/:name',verifyToken,fetchCommunity)
router.get('/getMessages/:name',verifyToken,getMessages)
router.post('/sendMessages',verifyToken,sendMessages)
export default router;
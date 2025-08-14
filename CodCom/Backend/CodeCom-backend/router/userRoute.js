import express from 'express';
import { updateUser, userProfile } from '../controller/userProfileController.js';


const router= express.Router()
router.get('/userProfile',userProfile)
router.post('/updateUser',updateUser)

export default router;
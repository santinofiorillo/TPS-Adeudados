import {Router} from 'express';
import Users from '../dao/dbManagers/users.js';

const usersManager = new Users();
const router = Router();

router.get('/', async (req,res)=>{
    let users = await usersManager.getAll();
    if(!users) return res.status(500).send({status:"error",error:"Couldn't get users due to internal error"})
    res.send({status:"success",payload:users})
})

router.post('/',async(req,res)=>{
    let {first_name,last_name,dni,email,birthDate,gender} = req.body;
    if(!first_name||!last_name||!dni||!email||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    let result = await usersManager.saveUser({
        first_name,
        last_name,
        email,
        dni,
        birthDate,
        gender
    })
    if(!result) return res.status(500).send({status:"success",payload:result})
    res.send({status:"success",payload:result})
})

export default router;
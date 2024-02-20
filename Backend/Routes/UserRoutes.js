
// const express = require('express');
// const router = express.Router();
// const authController = require('../Controllers/UserController');
// const authMiddleware = require('../Middlewares/authMiddleware');

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// router.get('/protected', authMiddleware.authenticateUser, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
//   });
  
 
//   router.get('/admin', authMiddleware.authenticateUser, authMiddleware.checkAdminRole, (req, res) => {
//     res.json({ message: 'This is an admin-only route', user: req.user });
//   });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authController = require('../Controllers/UserController');
// const {authenticateUser,isAdmin}=require('../Middlewares/authMiddleware')

// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/test',authenticateUser,isAdmin, authController.test);

// module.exports = router;



const express = require('express');
const router = express.Router();
const authController = require('../Controllers/UserController');
const { authenticateUser, isAdmin } = require('../Middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/test', authenticateUser, isAdmin, authController.test);
router.get('/users', authenticateUser, isAdmin, authController.findAllUsers);
router.post('/forgot-password',authController.forgotPassword)
router.put('/update',authenticateUser,authController.updateUser)
router.put('/delete',authenticateUser,isAdmin,authController.deleteUser)
router.get('/orders',authenticateUser,authController.getOrders)
router.get('/orders',authenticateUser,isAdmin,authController.getAllorders)
router.get('/user-auth',authenticateUser,(req,res)=>{
    res.status(200).send({Sucess:true})
})
router.get('/admin-auth',authenticateUser,isAdmin,(req,res)=>{
    res.status(200).send({Sucess:true})
})

module.exports = router;

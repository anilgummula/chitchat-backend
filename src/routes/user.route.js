const {connections,networks,details, request,notifications,reacts, userInfo} = require('../controllers/user.controller');
const {ensureAuthenticated} = require('../middlewares/auth');

const router = require('express').Router();


router.post('/networks',ensureAuthenticated,networks);
router.post('/details',ensureAuthenticated,details);
router.post('/connections',ensureAuthenticated,connections);
router.post('/request',ensureAuthenticated,request);
router.post('/notifications',ensureAuthenticated,notifications);
router.post('/react',ensureAuthenticated,reacts);
router.get('/:id',ensureAuthenticated,userInfo);

module.exports = router;
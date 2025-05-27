const {connections,networks,details, request,notifications,reacts} = require('../controllers/user.controller');
const {ensureAuthenticated} = require('../middlewares/auth');

const router = require('express').Router();


router.get('/networks',ensureAuthenticated,networks);
router.post('/details',ensureAuthenticated,details);
router.post('/connections',ensureAuthenticated,connections);
router.post('/request',ensureAuthenticated,request);
router.post('/notifications',ensureAuthenticated,notifications);
router.post('/react',ensureAuthenticated,reacts);

module.exports = router;
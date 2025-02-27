const {connections,networks,details} = require('../controllers/userController');
const {ensureAuthenticated} = require('../middlewares/auth');

const router = require('express').Router();


router.get('/networks',ensureAuthenticated,networks);
router.post('/details',ensureAuthenticated,details);
router.post('/connections',ensureAuthenticated,connections);

module.exports = router;
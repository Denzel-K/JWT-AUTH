const { Router } = require('express');
const authcontroller = require("../controllers/authcontroller");
const bodyParser = require ("body-parser");
const { requireAuth, checkUser } = require ("../middleware/authMiddleware");
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
const router = Router();

router.get ("/", authcontroller.homePage_get);
router.get ("/sign_up", authcontroller.signup_get);
router.post ("/sign_up", jsonParser, authcontroller.signup_post);
router.get ("/sign_in", authcontroller.signin_get);
router.post ("/sign_in", jsonParser, authcontroller.signin_post);
router.get ("/success", requireAuth, authcontroller.success_get);
router.get ("/log_out", authcontroller.logout_get);

module.exports = router;
const express = require('express')
const router = express.Router()
const controller = require('../controllers/countryController')
const checkAPIKEY = require('../middleware/checkAPIKEY')
const { requireAuth, checkRoleAccount } = require('../middleware/checkAuth')

router.get('/', checkAPIKEY, controller.get)

router.post('/', checkAPIKEY, controller.post)

router.put('/', checkAPIKEY, requireAuth, checkRoleAccount('super_admin'), controller.put)

router.delete('/', checkAPIKEY, requireAuth, checkRoleAccount('super_admin'), controller.delete)

module.exports = router
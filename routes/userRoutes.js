const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} = require('../controllers/userController')

router
  .route('/')
  //.get(authenticateUser, authorizePermissions('admin'), getAllUsers)
  .get(getAllUsers)

router.route('/current').get(authenticateUser, showCurrentUser)
/*router
  .route('/updateUser')
  .patch(authenticateUser, updateUser)
*/
// for front-end
router.route('/:id').patch(updateUser)

router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

router
  .route('/:id')
  //.get(authenticateUser, getSingleUser)
  .get(getSingleUser)
  .delete(deleteUser)

module.exports = router

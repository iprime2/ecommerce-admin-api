const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')

const {
  createReview,
  getSingleReview,
  getProductReviews,
  getSingleProductReviews,
  updateProductReview,
  deleteProductReview,
} = require('../controllers/reviewController')

router
  .route('/')
  //.post(authenticateUser, createReview)
  .post(createReview)
  //.get(authenticateUser, getProductReviews)
  .get(getProductReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(updateProductReview)
  //.patch(authenticateUser, updateProductReview)
  //.delete(authenticateUser, deleteProductReview)
  .delete(deleteProductReview)

module.exports = router

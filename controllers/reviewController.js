const Product = require('../models/Product')
const Review = require('../models/Reviews')

const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const createReview = async (req, res) => {
  /*old
  const productId = req.query.product
  
  req.query.user = req.user.userId*/
  console.log(req.body)

  const productId = req.body.product
  const userId = req.body.user

  const isValidProduct = await Product.findOne({
    _id: productId,
  })

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product was found with id : ${productId}`
    )
  }

  const ifAlreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  })

  if (ifAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already review submitted for this product'
    )
  }

  const review = await Review.create(req.body)
  console.log(review)
  res.status(StatusCodes.CREATED).json({ review })
}

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })

  if (!reviews) {
    throw new CustomError.NotFoundError('There is no reviews')
  }

  res.status(StatusCodes.OK).json({ reviews })
}

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateProductReview = async (req, res) => {
  const reviewId = req.params.id
  const { rating, title, comment } = req.body || req.query

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`)
  }
  // to-do
  // req.user was unable to find from using front end
  //checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()

  res.status(StatusCodes.OK).json({ review })
}

const deleteProductReview = async (req, res) => {
  const reviewId = req.params.id

  const review = await Review.find({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }

  // not working in front-end
  //checkPermissions(req.user, review.user)

  await review.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}
module.exports = {
  createReview,
  getSingleReview,
  getProductReviews,
  getSingleProductReviews,
  updateProductReview,
  deleteProductReview,
}

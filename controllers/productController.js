const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const data = require('../mockData/products.json')

const createProduct = async (req, res) => {
  console.log(req.user)
  //console.log(req.user)

  //req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

// all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products })
}

//single product
const getSingleProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id })

  if (!product) {
    throw new CustomError.NotFoundError(`Unable to find the product with ${id}`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new CustomError.NotFoundError(`No product found with id ${id}`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id })
  if (!product) {
    throw new CustomError.NotFoundError(`No product found with id ${id}`)
  }

  await product.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed' })
}

// to do upload files
const uploadImage = async (req, res) => {}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}

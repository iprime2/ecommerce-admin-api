const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const userId = req.params.id

  const user = await User.findOne({ _id: userId }).select('-password')

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id : ${userId}`)
  }
  // to-do this not a function
  //using in front end the req.user is not available
  //checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { email, name, role } = req.body || req.query
  const id = req.params.id || req.user.userId

  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide both Value')
  }

  const user = await User.findOne({ _id: id })

  if (!user) {
    throw new CustomError.NotFoundError(`Not found with id: ${id}`)
  }

  user.name = name
  user.email = email
  user.role = role

  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updateUserPassword = async (req, res) => {
  console.log('Inside update user pass')

  const { oldPassword, newPassword } = req.query
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide Old and New Password')
  }

  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Inavalid Credentials')
  }

  user.password = newPassword

  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Success! Password Changed', user })
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id })
  if (!user) {
    throw new CustomError.NotFoundError(`No User found with id ${id}`)
  }

  await user.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! user removed' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
}

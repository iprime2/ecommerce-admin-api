const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { create } = require('../../final/models/Review')
const { createTokenUser, attachCookiesToResponse } = require('../utils/index')

const register = async (req, res) => {
  let { email, name, password, role } = req.body || req.query

  //checking if email already exist
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  //first account will be registered as admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  if (isFirstAccount === 0) {
    role = 'admin'
  }

  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body || req.query

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials E-mail')
  }
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials Password')
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  const token = req.signedCookies.token

  tokenUser.accessToken = token
  tokenUser.email = email

  console.log(tokenUser)

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = {
  register,
  login,
  logout,
}

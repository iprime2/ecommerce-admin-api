const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
  return token
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })
  const oneDay = 1000 * 60 * 60 * 24
  const exDate = new Date(Date.now + oneDay)

  res.cookie('token', token, {
    httpOnly: true,
    expires: exDate,
    signed: true,
    domain: 'http://localhost:3000/',
    sameSite: 'none',
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}

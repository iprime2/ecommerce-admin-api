require('dotenv').config({ path: './.env' })
require('express-async-errors')

const express = require('express')
const app = express()

const corsOptions = require('./config/corsOptions')

// packages
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

//connect database
const connectDB = require('./db/connect')

//routes
const authRouter = require('./routes/authRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const userRouter = require('./routes/userRoutes')
const orderRouter = require('./routes/orderRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// all app.use
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)

app.use(helmet())

//cross Origin Resource Sharing
app.use(cors(corsOptions))
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))
//app.use(bodyParser(process.env.JWT_SECRET))

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/orders', orderRouter)

//todo
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

console.log(process.env.MONGO_URI)
//server
const port = process.env.PORT || 4000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server connected to ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()

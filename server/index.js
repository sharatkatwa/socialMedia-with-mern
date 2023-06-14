import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import { register } from './controllers/auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/asseets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

// ROUTES
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

// ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), register)

const PORT = process.env.PORT || 6001

// MONGODB SETUP
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully')
    app.listen(PORT, (req, res) => {
      console.log(`server is listing to http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error, "couldn't connect to database")
  })

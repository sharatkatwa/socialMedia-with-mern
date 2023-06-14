import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

// REGISTER USER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body
    const viewedProfile = Math.floor(Math.random() * 10000)
    const impresstion = Math.floor(Math.random() * 100000)

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impresstion,
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'user does not exists.' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'invalid credentials.' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password

    return res.status(200).json({ token, user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

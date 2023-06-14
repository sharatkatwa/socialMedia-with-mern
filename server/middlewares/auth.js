import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers('Authorization')

    if (!token) {
      return res.status(401).json({ msg: 'access denied' })
    }
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1]
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    req.user = verified
    next()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

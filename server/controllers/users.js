import User from '../models/userModel.js'

export const getUser = (req, res) => {
  try {
    const { id } = req.params

    const user = User.findById(id)
    res.status(200).json({ user })
  } catch (error) {}
}
export const getUserFriends = (req, res) => {}
export const addRemoveFriend = (req, res) => {}

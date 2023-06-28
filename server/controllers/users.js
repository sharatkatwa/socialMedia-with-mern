import User from '../models/userModel.js'

// READ USER
export const getUser = (req, res) => {
  try {
    const { id } = req.params

    const user = User.findById(id)
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// READ USER FRIENDS
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params
    const user = User.findById(id)

    const friends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id)
      })
    )
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath }
      }
    )

    res.status(200).json(formattedFriends)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE ADDREMOVEFRIEND
export const addRemoveFriend = async (req, res) => {
  try {
    const { id: userId, friendId } = req.params
    user = await User.findById(userId)
    friend = await User.findById(friendId)
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId)
      user.friends = friend.friends.filter((id) => id !== userId)
    } else {
      user.friends.push(friendId)
      friend.friends.push(userId)
    }

    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id)
      })
    )
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

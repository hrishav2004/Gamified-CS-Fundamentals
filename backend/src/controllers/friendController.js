const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await friendRequest.save();
    await friendRequest.populate('sender', 'username profile');

    res.status(201).json({
      message: 'Friend request sent successfully',
      friendRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ 
      receiver: req.user._id,
      status: 'pending'
    }).populate('sender', 'username profile');

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'reject'

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    friendRequest.status = action === 'accept' ? 'accepted' : 'rejected';
    await friendRequest.save();

    if (action === 'accept') {
      // Add each other as friends
      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.receiver }
      });
      await User.findByIdAndUpdate(friendRequest.receiver, {
        $addToSet: { friends: friendRequest.sender }
      });
    }

    res.json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username profile stats');

    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends
};
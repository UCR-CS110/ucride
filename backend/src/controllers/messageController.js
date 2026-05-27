const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    req.body.senderId = req.user.id;
    const message = await Message.create(req.body);

    if (req.io) {
        const normalizedMessage = {
            _id: message._id.toString(),
            senderId: message.senderId.toString(),
            receiverId: message.receiverId.toString(),
            rideId: message.rideId.toString(),
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };

        req.io.to(req.body.receiverId).emit('newMessage', normalizedMessage);
        req.io.to(req.user.id).emit('newMessage', normalizedMessage);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { rideId, otherUserId } = req.query;
    
    if (!rideId && !otherUserId) {
      const messages = await Message.find({
        $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
      })
      .sort('-createdAt')
      .populate('senderId', 'fName lName profilePictureUrl')
      .populate('receiverId', 'fName lName profilePictureUrl')
      .populate('rideId');

      const conversationsMap = {};
      messages.forEach(msg => {
        const otherUser = msg.senderId._id.toString() === req.user.id ? msg.receiverId : msg.senderId;
        const key = `${msg.rideId._id.toString()}_${otherUser._id.toString()}`;
        
        if (!conversationsMap[key]) {
          conversationsMap[key] = {
            id: key,
            rideId: msg.rideId,
            otherUser,
            lastMessage: msg.content,
            time: msg.createdAt,
            isRead: msg.isRead,
            senderId: msg.senderId._id
          };
        }
      });
      
      const conversations = Object.values(conversationsMap);
      return res.status(200).json({ success: true, data: conversations });
    }

    if (!rideId || !otherUserId) {
        return res.status(400).json({ message: 'Please provide rideId and otherUserId' });
    }

    const messages = await Message.find({
      rideId,
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    }).sort('createdAt');

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
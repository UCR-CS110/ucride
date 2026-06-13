const Message = require('../models/Message');
const Ride = require('../models/Ride');

async function isRideMember(rideId, userId) {
  const ride = await Ride.findById(rideId);
  if (!ride) return false;
  return (
    ride.driverId.toString() === userId.toString() ||
    ride.requests.some(
      r => r.userId.toString() === userId.toString() && r.status === 'accepted'
    )
  );
}

exports.sendMessage = async (req, res) => {
  try {
    const { rideId, content } = req.body;

    if (!await isRideMember(rideId, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized for this ride' });
    }

    const message = await Message.create({ senderId: req.user.id, rideId, content });
    const populated = await Message.findById(message._id).populate('senderId', 'fName lName');

    if (req.io) {
      req.io.to(rideId.toString()).emit('newMessage', {
        _id: populated._id.toString(),
        senderId: {
          _id: populated.senderId._id.toString(),
          fName: populated.senderId.fName,
          lName: populated.senderId.lName,
        },
        rideId: populated.rideId.toString(),
        content: populated.content,
        createdAt: populated.createdAt,
        updatedAt: populated.updatedAt,
      });
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { rideId } = req.query;

    if (rideId) {
      if (!await isRideMember(rideId, req.user.id)) {
        return res.status(403).json({ success: false, message: 'Not authorized for this ride' });
      }

      const messages = await Message.find({ rideId })
        .sort('createdAt')
        .populate('senderId', 'fName lName');

      return res.status(200).json({ success: true, data: messages });
    }

    const rides = await Ride.find({
      $or: [
        { driverId: req.user.id },
        { requests: { $elemMatch: { userId: req.user.id, status: 'accepted' } } },
      ],
    });

    const rideIds = rides.map(r => r._id);

    const lastMessages = await Message.aggregate([
      { $match: { rideId: { $in: rideIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$rideId', lastMessage: { $first: '$content' }, time: { $first: '$createdAt' } } },
    ]);

    const lastMsgMap = {};
    lastMessages.forEach(lm => {
      lastMsgMap[lm._id.toString()] = lm;
    });

    const conversations = rides.map(ride => ({
      id: ride._id.toString(),
      rideId: ride._id.toString(),
      rideName: `${ride.departureLocation.name.split(',')[0]} → ${ride.destination.name.split(',')[0]}`,
      lastMessage: lastMsgMap[ride._id.toString()]?.lastMessage || '',
      time: lastMsgMap[ride._id.toString()]?.time || ride.createdAt,
    }));

    conversations.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

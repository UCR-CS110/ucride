exports.getAllMessages = async (req, res) => {
  res.status(200).json({ message: 'Get all messages not implemented yet' });
};

exports.getMessageById = async (req, res) => {
  res.status(200).json({ message: `Get message ${req.params.id} not implemented yet` });
};

exports.createMessage = async (req, res) => {
  res.status(201).json({ message: 'Create message not implemented yet' });
};

exports.updateMessage = async (req, res) => {
  res.status(200).json({ message: `Update message ${req.params.id} not implemented yet` });
};

exports.deleteMessage = async (req, res) => {
  res.status(200).json({ message: `Delete message ${req.params.id} not implemented yet` });
};

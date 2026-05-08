exports.getAllUsers = async (req, res) => {
  res.status(200).json({ message: 'Get all users not implemented yet' });
};

exports.getUserById = async (req, res) => {
  res.status(200).json({ message: `Get user ${req.params.id} not implemented yet` });
};

exports.createUser = async (req, res) => {
  res.status(201).json({ message: 'Create user not implemented yet' });
};

exports.updateUser = async (req, res) => {
  res.status(200).json({ message: `Update user ${req.params.id} not implemented yet` });
};

exports.deleteUser = async (req, res) => {
  res.status(200).json({ message: `Delete user ${req.params.id} not implemented yet` });
};

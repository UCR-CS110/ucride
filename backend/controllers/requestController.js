exports.getAllRequests = async (req, res) => {
  res.status(200).json({ message: 'Get all requests not implemented yet' });
};

exports.getRequestById = async (req, res) => {
  res.status(200).json({ message: `Get request ${req.params.id} not implemented yet` });
};

exports.createRequest = async (req, res) => {
  res.status(201).json({ message: 'Create request not implemented yet' });
};

exports.updateRequest = async (req, res) => {
  res.status(200).json({ message: `Update request ${req.params.id} not implemented yet` });
};

exports.deleteRequest = async (req, res) => {
  res.status(200).json({ message: `Delete request ${req.params.id} not implemented yet` });
};

exports.getAllRides = async (req, res) => {
  res.status(200).json({ message: 'Get all rides not implemented yet' });
};

exports.getRideById = async (req, res) => {
  res.status(200).json({ message: `Get ride ${req.params.id} not implemented yet` });
};

exports.createRide = async (req, res) => {
  res.status(201).json({ message: 'Create ride not implemented yet' });
};

exports.updateRide = async (req, res) => {
  res.status(200).json({ message: `Update ride ${req.params.id} not implemented yet` });
};

exports.deleteRide = async (req, res) => {
  res.status(200).json({ message: `Delete ride ${req.params.id} not implemented yet` });
};

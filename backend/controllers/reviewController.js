exports.getAllReviews = async (req, res) => {
  res.status(200).json({ message: 'Get all reviews not implemented yet' });
};

exports.getReviewById = async (req, res) => {
  res.status(200).json({ message: `Get review ${req.params.id} not implemented yet` });
};

exports.createReview = async (req, res) => {
  res.status(201).json({ message: 'Create review not implemented yet' });
};

exports.updateReview = async (req, res) => {
  res.status(200).json({ message: `Update review ${req.params.id} not implemented yet` });
};

exports.deleteReview = async (req, res) => {
  res.status(200).json({ message: `Delete review ${req.params.id} not implemented yet` });
};

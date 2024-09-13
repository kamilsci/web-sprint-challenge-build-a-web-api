function validateActionBody(req, res, next) {
    const { project_id, description, notes } = req.body;
    if (!project_id || !description || !notes) {
      return res.status(400).json({ message: 'Missing required fields: project_id, description, and notes' });
    }
    next();
  }

module.exports = {
    validateActionBody
  };
  
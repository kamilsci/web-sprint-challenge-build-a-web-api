function validateProjectBody(req, res, next) {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Missing required fields: name and description' });
    }
    next();
  }
  
  module.exports = {
    validateProjectBody
  };
  

  
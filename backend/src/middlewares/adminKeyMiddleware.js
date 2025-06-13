const adminKeyMiddleware = (req, res, next) => {
  const adminKey = req.header('X-Admin-Key');
  
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: 'Access denied. Invalid admin key.' });
  }
  
  next();
};

module.exports = adminKeyMiddleware;
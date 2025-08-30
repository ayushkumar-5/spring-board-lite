export default (req, res, next) => {
  // Simulate 10% failure rate for PATCH and POST requests
  if ((req.method === 'PATCH' || req.method === 'POST') && Math.random() < 0.1) {
    console.log(`🚨 Simulating API failure for ${req.method} ${req.path}`);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Simulated failure for testing rollback functionality'
    });
  }
  
  next();
};

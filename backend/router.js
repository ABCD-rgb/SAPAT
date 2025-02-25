
const handleRoutes = (app) => {
  // Check if user is authenticated middleware
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
  };

  // Get current user route
  app.get('/api/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  // Logout route
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging out' });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Error destroying session' });
        }
        res.clearCookie('connect.sid');  // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  });

  app.get('/login/failed', (req, res) => {
    res.status(401).json({
      success: false,
      message: req.session?.messages?.[0] || "Authentication failed"
    });
  });
};

export default handleRoutes;

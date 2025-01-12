// Middleware to verify admin role
// const verifyAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admins only.' });
//     }
//     next();
//   };
  
const verifyAdmin = (req, res, next) => {
  console.log('Decoded User from Token:', req.user); // Log the user decoded from the token

  // Check if the role is 'admin'
  if (!req.user || req.user.role !== 'admin') {
    console.log('Access Denied: User is not admin or role is missing');
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  next();
};

module.exports = verifyAdmin;

  // module.exports = verifyAdmin;
  
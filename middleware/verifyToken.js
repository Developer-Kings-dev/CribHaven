// const jwt = require('jsonwebtoken');

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
//     if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Add decoded user data to request object
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };

// module.exports = verifyToken;

// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded); // Log the decoded token payload
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message); // Log token errors
//     res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };

// module.exports = verifyToken;

// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.split(' ')[1]; // Extract token
//     if (!token) {
//       console.log('No token provided');
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     // Decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded); // Log the decoded token

//     req.user = decoded; // Attach the decoded user to the request
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message); // Log token errors
//     res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;

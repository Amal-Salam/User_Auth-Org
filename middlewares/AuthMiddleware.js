const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    // console.log(authHeader);
    return res.status(400).json({
      field: 'Unauthorized',
      message: 'No token, authorization denied',
      
    });
  }
  
 const token = authHeader.replace('Bearer', '');
//  console.log(token);
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded.userId;
    // console.log("from Auth:",req.user);
    next();
  } catch (err) {
    console.error(err)
    res.status(401).json({
      status: 'Unauthorized',
      message: 'Token is not valid',
      
    });
  }
};

module.exports = auth;

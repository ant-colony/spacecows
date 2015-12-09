/*
  ...
*/
import config from '../../app.config';
import jwt from 'jsonwebtoken'; 


export default function checkToken(req) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  return new Promise((resolve, reject) => {
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config().secret, function(err, decoded) {
        if (err) {
          var error = new Error('Failed to authenticate token.');
          error.statusCode = 403;
          reject(error);
        } else {
          // if everything is good, save to request for use in other routes
          req.decodedUser = decoded; // user is in decoded
          resolve(decoded)
        }
      });
  
    } else {
      // if there is no token
      // return an error
      var error = new Error('No token provided!');
      error.statusCode = 403;
      reject(error);
    }
  })

}
import checkJSWToken from '../core/security/checkJSWToken';

export function isAuthenticated(roles) {
  
  return function(req, res, next) {
    checkJSWToken(req).then(connectedUser => {
      
      console.log(`Checking authentication for roles: ${roles}`);
      console.log(`Role of the connectedUser: ${connectedUser.role}`);
      
      if(roles.length==0 || roles.indexOf(connectedUser.role) > -1) {
        return next();
      } else {
        let error = new Error('Not appropriate ability!.');
        error.statusCode = 403;
        next(error);          
      }        
    }).catch(err => {
      next(err); // no token
    });      
  }
}

/*--- for tests ---*/
export function check(something) {
  return function(req, res, next) {
    console.log(`checking: ${something}`);
    return next();
  }
}

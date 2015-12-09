import {RoutesController} from '../../core/controllers/routesController';

//import {Authenticated} from '../../core/check.decorators'
import {User} from './user';

import crypt from '../../core/security/crypto-ctr';
import config from '../../app.config';
import jwt from 'jsonwebtoken'; 

export class UsersController extends RoutesController {
  constructor(collection) {
    super(collection)
    // define routes
    
    /*--- authentication ---*/
    this.router.post('/authenticate', (req, res, next) => this.authenticate(req, res, next));
    
    /*--- get all users ---*/
    this.router.get('/', (req, res, next) => this.getUsers(req, res, next));
    
  }
    
  /* authentication */
  authenticate(req, res, next) {
    
    console.log("authenticate", req.body)
    
    let user = new User(this.collection, req.body);
    
    
    user.checkPassword(user.password) // here password isn't encrypted
      .then(data => {
        // if user is found and password is right
        // create a token
        let token = jwt.sign(data, config().secret, { // data = user
          expiresIn: config().tokenExpiration // expires in N seconds
        });
  
        // return the information including token as JSON
        res.json({
          token: token,
          user: {
            login : user.login,
            firstName : user.firstName,
            lastName  : user.lastName,
            language  : user.language,
            email     : user.email,
          }
        });
      })
      .catch(err => { 
        return next(err)
        
      }); // status ???   
  }  
  
  /*--- get all users without _id and password ---*/
  getUsers(req, res, next) {
    User.all(this.collection, {password:0, _id:0}).then(users => {
      res.json(users)
    })
    .catch(err => {return next(err)});    
  };
  
}

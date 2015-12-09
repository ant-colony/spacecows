import {RoutesController} from '../../core/controllers/routesController';

import {isAuthenticated} from '../../middlewares/check'

import crypt from '../../core/security/crypto-ctr';
import config from '../../app.config';
import jwt from 'jsonwebtoken'; 

export class YoController extends RoutesController {
  constructor() {
    super()
    // define routes
        
    /*--- only admin ---*/
    this.router.get('/onlyadmin', isAuthenticated(["admin"]), (req, res, next) => {
      res.json({message:"Welcome Administrator!"})
    });  
        
  }
    
}

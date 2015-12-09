import {Model} from '../../core/models/model'
import crypt from '../../core/security/crypto-ctr';
import config from '../../app.config';

export class User extends Model {
  
  constructor(db, fields) {
    super(db, fields)
  }
/*
  {
    login:"bob", 
    firstName:"Bob", 
    lastName:"Morane", 
    email:"bob.morane@gmail.com", // login is email
    language:"EN", 
    password: crypt(config().secret).encrypt("morane"),
    role: "admin"
  }
*/
  checkPassword(pwd) {
    return new Promise((resolve, reject) => {
      
      this.fetch({email:this.email}).then(user => {
        
        console.log("user:", user)
        console.log("pwd", pwd)
        
        if(user.password == crypt(config().secret).encrypt(pwd)) {
          console.log("User is authenticated", user)
          resolve(user);
        } else {
          let error = new Error('Bad login or/and bad password.');  
          reject(error);          
        }
      }).catch(err => {
          let error = new Error('User is unknown.');  
          reject(error);          
      })
      
    }); 
  } // end checkLoginPassword  
  
  
} // end class

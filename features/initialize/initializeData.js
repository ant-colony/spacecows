/*--- initialize NeDB data ---*/
import crypt from '../../core/security/crypto-ctr';
import config from '../../app.config';

let random = (maxNum) => {
  return Math.ceil(Math.random() * maxNum);
};


/*--- initialize some cows ---*/
export function generateCowsData(dbCollection) {
  let cows = [
    { nickname:"Prudence", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Hazel", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Daisy", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Lilly", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Cinnamon", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Caramelle", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Martha", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Moode", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Button", sex:"female", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    
    { nickname:"Bigfoot", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Vegas", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"George", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Gus", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Kargo", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Chuck", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Boomboom", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Warpath", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Tiny", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },
    { nickname:"Spice", sex:"male", size:5, x: random(config().constraints.width), y: random(config().constraints.height) },

  ]; 
  
  return new Promise((resolve, reject) => {
    
    dbCollection.count({}, (err, count) => {
      if(err) reject(err);
      if(count>0) {
        resolve(true)
      } else {
        dbCollection.insert(cows, (err, newCows) => {
          if(err) reject(err);
          resolve(newCows)
        });           
      }
    });   
  })
}

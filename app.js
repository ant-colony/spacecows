import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import Datastore from 'nedb';

/*--- models ---*/
import {Cow} from './features/cows/cow';

/*--- controllers ---*/
import {CowsController} from './features/cows/cowsController';

/*--- error handler (middleware) ---*/
import errorHandler from './middlewares/errorHandler';

import config from './app.config';

/*--- data ---*/
import {generateCowsData} from './features/initialize/initializeData';

let app = express(), httpPort = config().httpPort;

app
  .use(express.static(__dirname + '/public'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json());
  
/*--- Database and collections ---*/
let db = {};

db.cows = new Datastore('./cows.db');
let dbUsersPromise = () => new Promise((resolve, reject) => {
  db.users.loadDatabase(err => {
    if(err) reject(err)
    resolve("users:ok")
  })
});

let dbCowsPromise = () => new Promise((resolve, reject) => {
  db.cows.loadDatabase(err => {
    if(err) reject(err)
    resolve("cows:ok")
  })
});

/*
  - start express when all databases are loaded
*/
Promise.all([dbCowsPromise()])
  .then(results => {
    
    Promise.all([generateCowsData(db.cows)]) // Initialize data if first time
      .then(results => {
        
        // if all is OK we have to load and start cows
        Cow.all(db.cows, {}).then(cows => {
          //console.log(cows);
          
          cows.forEach(cowData => {
            let spaceCow = new Cow(db.cows, cowData);
            spaceCow.start(); 
          });
          
          
        }).catch(err => console.log("Error when starting space cows....", err));    
        
        app
          .use('/api/cows', new CowsController(db.cows).router)
          .use(errorHandler) // always last use
          
        app.listen(httpPort);
          
        console.log(" Listening on: " + httpPort);        
      })
      .catch(err => console.log("Error when generating(or checking) collections", err))
    
  })
  .catch(err => {
    console.log("Error when loading collections", err)
  });


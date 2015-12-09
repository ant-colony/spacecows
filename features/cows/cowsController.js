import {RoutesController} from '../../core/controllers/routesController';
import {Cow} from './cow';
import {TinyWorker} from '../../core/workers/tinyworker'

//import config from '../../app.config';

export class CowsController extends RoutesController {
  constructor(collection) {
    super(collection)
   
    this.openConnections = [];
    
    // define routes
    /* --- get all cows ---*/
    this.router.get('/', (req, res, next) => this.getCows(req, res, next));
    
    /* --- get one cow ---*/
    this.router.get('/:nickname', (req, res, next) => this.getCow(req, res, next));
    
    /* --- add a cow ---
      becareful, the unique id is the nickname
    */
    this.router.post('/', (req, res, next) => this.addCow(req, res, next));
    
    /* --- update a cow ---*/
    this.router.put('/:nickname', (req, res, next) => this.updateCow(req, res, next));
       
    /* --- delete a cow ---*/
    this.router.delete('/:nickname', (req, res, next) => this.deleteCow(req, res, next));
    
    /* --- server sent events --- 
      simple route to register the clients
      source: http://www.smartjava.org/content/html5-server-sent-events-angularjs-nodejs-and-expressjs
    */
    this.router.get('/sse/all', (req, res, next) => this.sse(req, res, next));
    
    this.router.get('/sse/kill', (req, res, next) => this.killSseWorker(req, res, next));
    
    this.worker = new TinyWorker((message) => {
      Cow.all(this.collection, {}).then(cows => {
        // we walk through each connection
        this.openConnections.forEach((resp) => {
          var d = new Date();
          resp.write('id: ' + d.getMilliseconds() + '\n');
          resp.write('data:' + JSON.stringify(cows) +   '\n\n');
        });          
      }).catch(err => {
          console.log(err);
      });        
    });
    
    this.worker.start("go");
    console.log("SSE Worker is started.")

  }
  
  killSseWorker(req, res, next) {
    this.worker.kill()
    delete this.worker;
    console.log("SSE Worker is killed.")
    res.json({message:"SSE Worker is killed."});
  }
  
  sse(req, res, next) {
    // set timeout as high as possible
    //req.socket.setTimeout(5000); //ms?
 
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
 
    // push this res object to our global variable
    this.openConnections.push(res);
 
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
      var toRemove;
      this.openConnections = this.openConnections != null ? this.openConnections : []
      for (var j =0 ; j < this.openConnections.length ; j++) {
        if (this.openConnections[j] == res) {
          toRemove =j;
          break;
        }
      }
      this.openConnections.splice(j,1);
      console.log(this.openConnections.length);
    });    
  }
  
  
  /* --- get all cows ---*/
  getCows(req, res, next) {
    Cow.all(this.collection, {}).then(cows => res.json(cows)).catch(err => next(err));    
  }
  
  /* --- get cow by nickname ---
    http://localhost:8080/api/cows/Caramelle
  */
  getCow(req, res, next) {
    let cow = new Cow(this.collection,{});
    cow.fetch({nickname:req.params.nickname})
      .then(cowData => {
        console.log("get a cow")
        if(cowData!=null) {
          res.json(cowData)
        } else { // this cow doesn't exist
          var error = new Error("This cow doesn't exist!");
          error.statusCode = 404;
          next(error);
        }        
        
      })
      .catch(err => next(err));
  }
  
  /* --- add a cow --- */
  addCow(req, res, next) {
    console.log("req.body", req.body)
    let cow = new Cow(this.collection,req.body);
    
    cow.fetch({nickname:cow.nickname})
      .then(cowData => {
        if(cowData==null) {
          // create the cow
          cow.create().then(cowData => {
            cow.start();
            res.redirect(req.baseUrl+'/'+cow.nickname) // redirect when posted
          }).catch(err => next(err))
          
        } else { // this cow already exists
          var error = new Error('This cow already exists!');
          error.statusCode = 409;
          next(error);
        }
      }).catch(err => next(err));  
  };
    
  /* --- update a cow ---*/
  updateCow(req, res, next) {
    let cow = new Cow(this.collection, req.body);
        
    cow.fetch({nickname:req.params.nickname})
      .then(cowData => {
        if(cowData!=null) {
          
          let foundCow = Cow.cowsList.find(spaceCow => spaceCow.nickname == cowData.nickname);
          
          // add data to the cow in the list      
          Object.assign(
            foundCow, 
            req.body
          );

          
          // updated by the cow worker
          // then cow.update() is not called here
          
          res.json(foundCow.toJson())
          
        } else { // this cow doesn't exist
          var error = new Error("This cow doesn't exist!");
          error.statusCode = 404;
          next(error);
        }
      }).catch(err => next(err));  
    
  };
  
  /* --- delete a cow ---*/
  deleteCow(req, res, next) {
    let cow = new Cow(this.collection,{});
        
    cow.fetch({nickname:req.params.nickname})
      .then(cowData => {
        if(cowData!=null) {
          
          let foundCow = Cow.cowsList.find(spaceCow => spaceCow.nickname == cowData.nickname);

          foundCow.remove().then(data => {            
            res.json(foundCow.toJson())
          }).catch(err => next(err));  
          
          
        } else { // this cow doesn't exist
          var error = new Error("This cow doesn't exist!");
          error.statusCode = 404;
          next(error);
        }
      }).catch(err => next(err));  
    
  };  
  

}
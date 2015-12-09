/*--- NeDb Model ---*/
export class Model {
  
  create() {
    return new Promise((resolve, reject) => {
      
      this.collection.insert(this.toJson(), (err, newDataModel) => {
        if(err) reject(err);
        Object.assign(this, newDataModel); // or only _id?
        resolve(newDataModel);        
      });      
    });
  }

  update() {
    //console.log("updating ....")
    return new Promise((resolve, reject) => {
      this.collection.update({_id: this._id}, this.toJson(), (err, numReplaced) => {
        if(err) reject(err);
        resolve(numReplaced);
      });
    });
  }

  remove() {
    return new Promise((resolve, reject) => {
      this.collection.remove({_id: this._id}, {}, (err, numRemoved) => {
        if(err) reject(err);
        resolve(numRemoved);
      });
    });
  }  
  
  
  /*
    model.fetch({email:'bob@morane.fr'}).then(user => {}).catch(err => {})
  */
  fetch(options) { // fetch = findOne
    return new Promise((resolve, reject) => {
      
      this.collection.findOne(options, (err, dataModel) => {
                
        if(err) reject(err); 
        
        Object.assign(this, dataModel);
        resolve(dataModel);          
        

      });       
    });
  }
  
  toJson() {
    let o = {} 
    Object.assign(o, this);
    delete o.collection;
    return o;
  }
  
  
  constructor(collection, fields) {
    Object.assign(this, fields);
    this.collection = collection;
  }
  
  static all(collection, options) { // asJson
    return new Promise((resolve, reject) => {
      
      collection.find({}, options, (err, models) => {
        if(err) reject(err);
        resolve(models)
      });   
    });    
  }
  
}

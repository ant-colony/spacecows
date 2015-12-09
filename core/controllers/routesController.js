import express from 'express';

export class RoutesController {
  
  constructor(dataBaseCollection) {
    this.router = express.Router();
    this.collection = dataBaseCollection;
  }
  
  
}
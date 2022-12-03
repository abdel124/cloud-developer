import express from 'express';
import { sequelize } from './sequelize';


import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';

import { V0MODELS } from './controllers/v0/model.index';
import {filterImageFromURL, deleteLocalFiles , outpath} from './util/util';
import { requireAuth } from './controllers/v0/users/routes/auth.router';
const {resolve} = require('path');


const fs = require('fs');
const Axios = require('axios');
const absolutePath = resolve("util/"+outpath);

(async () => {

  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen
  
  
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );

  app.get("/filteredimage",requireAuth, async ( req, res ) => {
    let uri : any = req.query.image_url;
    const filename: string = "unfiltred.jpeg";
    async function downloadImage(url: string, filepath: string) {
    const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
      });
      
      return new Promise((resolve, reject) => {
        try {
          response.data.pipe(fs.createWriteStream(filepath))
              .on('error', reject)
              .once('close', () => resolve(filepath));
        } catch (error) {
              console.log(error);
              reject(error);
        }
      });
  }
    deleteLocalFiles('util/tmp/')
    await downloadImage(uri,filename);
    await filterImageFromURL(filename);
    var contentType = "image/jpeg";
    fs.exists(absolutePath, function (exists: any) {
      if (!exists) {
          res.writeHead(404, {
              "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
      }
      var contentType = "image/jpeg";
      
      // Setting the headers
      res.writeHead(200, {
          "Content-Type": contentType });

      // Reading the file
      fs.readFile(absolutePath,
          function (err: any, content: string) {
              // Serving the image
              res.end(content);
          });
  });
    return res.status(200)
    
  });

  app.get("/authorized/filteredimage", async ( req, res ) => {
    let uri : any = req.query.image_url;
    const filename: string = "unfiltred.jpeg";
    async function downloadImage(url: string, filepath: string) {
    const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
      });
      
      return new Promise((resolve, reject) => {
        try {
          response.data.pipe(fs.createWriteStream(filepath))
              .on('error', reject)
              .once('close', () => resolve(filepath));
        } catch (error) {
              console.log(error);
              reject(error);
        }
      });
  }
    deleteLocalFiles('util/tmp/')
    await downloadImage(uri,filename);
    await filterImageFromURL(filename);
    var contentType = "image/jpeg";
    fs.exists(absolutePath, function (exists: any) {
      if (!exists) {
          res.writeHead(404, {
              "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
      }
      var contentType = "image/jpeg";
      

      // Setting the headers
      res.writeHead(200, {
          "Content-Type": contentType });

      // Reading the file
      fs.readFile(absolutePath,
          function (err: any, content: string) {
              // Serving the image
              res.end(content);
          });
  });
    return res.status(200);
    
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
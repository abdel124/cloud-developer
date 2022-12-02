import express from 'express';
import { sequelize } from './sequelize';


import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';

import { V0MODELS } from './controllers/v0/model.index';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

const fs = require('fs');
const Axios = require('axios');

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

  app.get("/filteredimage", async ( req, res ) => {
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
    
    await downloadImage(uri,filename);
    filterImageFromURL(filename);
    return res.status(200).send("success");
    deleteLocalFiles('src/util/tmp/');

  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
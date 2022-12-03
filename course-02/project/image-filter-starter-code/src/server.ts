import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles , outpath} from './util/util';
import { resolve } from 'path';
import { fstat, PathLike } from 'fs';


import fs from 'fs';
import Axios from 'axios';
const absolutePath : PathLike  = resolve("src/util/"+outpath);



(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user



  app.get( "/", async ( req, res ) => {
  
    res.send("try GET /filteredimage?image_url={{}}");
     
  } );

  app.get("/filteredimage", async ( req, res ) => {
    let uri : string = req.query.image_url;
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
    deleteLocalFiles('src/util/tmp/')
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
          function (err, content) {
              // Serving the image
              res.end(content);
          });
  });
    return res.status(200)
    
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
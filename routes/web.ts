import { randomUUID } from "crypto";
import AttendeeController from "../app/controllers/AttendeeController";
import DB from "../app/services/DB";
import manifest from "../public/manifest.json";
import { readFileSync } from "fs";

const HyperExpress = require("hyper-express");

const Route = new HyperExpress.Router();

let cache = {};

// guest routes
Route.get("/", AttendeeController.index);

Route.post("/attendee", AttendeeController.store); 

Route.post("/like", AttendeeController.like); 

Route.post("/comment", AttendeeController.comment); 

Route.get("/live-chat",AttendeeController.liveChat)

Route.get("/:file", async (request, response) => {
   const file = request.params.file;
 
   let content = cache[file] ? cache[file] : readFileSync(
      `./public/${file}`,
      "utf-8"
   );

   if(!cache[file])
   {
    cache[file] = content;
   }
   


   if(file.endsWith(".css"))
    return response.header("Content-Type","text/css").send(content);

    if(file.endsWith(".js"))
    return response.header("Content-Type","text/javascript").send(content);
})

export default Route;

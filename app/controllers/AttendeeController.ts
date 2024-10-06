
import { randomUUID } from "crypto";
import { Response, Request } from "../../type"; 
import DB from "../services/DB";

let audiences = [];

setInterval(async ()=>{

  const stat = await DB.from("recap").first();

  audiences.forEach((audience) => {
    audience.send(`live-audience:${audiences.length}:${stat.attendee_number}`);
  });
},1000 * 60)

class Controller {
    
  public async index (request : Request,response : Response) { 

   let visitor_id = request.cookies.visitor_id;

   if (!visitor_id) {

      visitor_id = randomUUID();

     try {
      await DB.from("attendees").insert({
         id: visitor_id,
      });
     } catch (error) {
      console.log(error)
     }

   

      response.cookie("visitor_id", visitor_id);
   }

   let submission = await DB.from("attendees").where("id", visitor_id).first();

   if (!submission) {
      await DB.from("attendees").insert({
         id: visitor_id,
      });
   }

   submission = await DB.from("attendees").where("id", visitor_id).first();


   const stat = await DB.from("recap").first();
   

   
 

   response.inertia("livestream", { submission, stat, audiences : audiences.length });
  }

  public async create (request : Request, response : Response) {
  }

  public async store (request : Request, response : Response) {

    const data = await request.json();

      try {
        await DB.from("attendees").where("id", data.id).update({
          name: data.name,
          like: data.like,
        });

        await DB.from("recap").increment("attendee_number", 1);
      } catch (error) {
        console.log(error)
      }

    return response.send("OK")

  }

  public async like (request : Request, response : Response) {

    const data = await request.json();

      try {
        await DB.from("attendees").where("id", data.id).update({
          name: data.name,
          like: data.like,
        });

        if(data.like)
        await DB.from("recap").increment("like_number", 1);
        else 
        await DB.from("recap").decrement("like_number", 1);
      } catch (error) {
        
      }

    return response.send("OK")

  }
 

  public async comment (request : Request, response : Response) {
    
    let data = await request.json();

    try {
     await DB.from("comments").insert({
        id : data.id,
        author_id: data.author_id,
        name: data.name,
        message: data.message,
        type: data.type,
        time: data.time
      });
      
      

    } catch (error) {

    }

    audiences.forEach((audience) => {
      audience.send(JSON.stringify(data));
    });

    return response.send("OK")
  }

  public async liveChat (request, response) {
    response
    .status(200)
    .header("Content-Type", "text/event-stream")
    .header("Connection", "keep-alive")
    .header("Cache-Control", "no-cache");
 
 

    response.sse.open();
    // OR you may also send a message which will open the stream automatically
    response.sse.send("initialize");

    

    // Assign a unique identifier to this stream and store it in our broadcast pool
    response.sse.id = request.cookies.visitor_id;

    audiences.push(response.sse);

    response.once("close", async () => {

      const index = audiences.indexOf(response.sse);

      if (index > -1) {
        audiences.splice(index, 1);
      }
        
    });
  }

  public async destroy (request : Request, response : Response) {
  }

}

export default new Controller()
  
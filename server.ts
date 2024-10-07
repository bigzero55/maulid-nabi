require("dotenv").config();

import inertia from "./app/middlewares/inertia";
import DB from "./app/services/DB";
import Web from "./routes/web";

import HyperExpress from "hyper-express";

const webserver = new HyperExpress.Server();

const LiveDirectory = require("live-directory");

//  rendering html files

//
webserver.use(inertia());

var cors = require("cors");

webserver.use(cors());

webserver.use(Web);

const LiveAssets = new LiveDirectory(__dirname + "/public", {
  // We want to provide the system path to the folder. Avoid using relative paths.
  keep: {
    extensions: [".css", ".js", ".json", ".png", ".jpg", ".jpeg"], // We only want to serve files with these extensions
  },
  cache: {
    max_file_count: 200, // 2.5 MB * 200 = 250 MB - This means you won't go over 250 MB of cached memory for your assets
    max_file_size: 1024 * 1024 * 2.5, // 2.5 MB - Most assets will be under 2.5 MB hence they can be cached
  },
  ignore: (path) => {
    return path.startsWith("."); // We want to ignore dotfiles for safety
  },
});

(async () => {
  const check = await DB.from("recap").first();

  if (!check) {
    await DB.from("recap").insert({
      like_number: 0,
      attendee_number: 0,
      peak_viewer: 0,
    });
  }
})();

const PORT = parseInt(process.env.PORT) || 5000;

// Activate webserver by calling .listen(port, callback);

webserver.set_error_handler((req, res, error: any) => {
  console.log(error);

  if (error.code == "SQLITE_ERROR") {
    res.status(500);
  }

  res.json(error);
});

webserver.listen(PORT).then(() => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  process.exit(0);
});

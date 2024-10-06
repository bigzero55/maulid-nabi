import { view } from "../services/View";
import { asset } from "../services/helper";
let pkg = require("../../package.json");

const inertia = () => {
   return (req, res, next) => {
      res.inertia = async (component, inertiaProps = {}, viewProps = {}) => {
         const url = `//${req.get("host")}${req.originalUrl}`;

         let props = {
            ...inertiaProps,
            ...viewProps,
            error: null,
            user: req.user || {},
         } as any;

         if (req.cookies.error) {
            props.error = req.cookies.error;
         }

         const inertiaObject = {
            component: component,
            props: props,
            url: url,
            version: pkg.version,
         };

         if (!req.header("X-Inertia")) {
            const html = `<!DOCTYPE html>
<html lang="en-gb">
   <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MAULID NABI</title> 
      <link rel="stylesheet" href="${asset("style.css")}"> 
   <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
      <link rel="icon" type="image/x-icon" href="/icon/favicon-white.png" />  
     <style>
         .tutor-video-player .plyr--youtube iframe {
            top: -50%;
            height: 200% !important;
         }
         .tutor-video-player
            .plyr--youtube.plyr--paused.plyr--loading.plyr__poster-enabled
            .plyr__poster {
            opacity: 1 !important;
         }
         button[name="complete_course"].tutor-topbar-mark-btn {
            background-color: #fff !important;
            color: var(--tutor-color-primary) !important;
         }

         .editor-wrapper h1 {
            font-weight: bold;
            font-size: 2rem;
         }
         .editor-wrapper h2 {
            font-weight: bold;
            font-size: 1.75rem;
         }
         .editor-wrapper h3 {
            font-weight: bold;
            font-size: 1.5rem;
         }

         .editor-wrapper h4 {
            font-weight: bold;
            font-size: 1.25rem;
         }
      </style>
   </head>
   <body>
      <div class="bg-gray-50 min-h-screen" id="app" data-page="${JSON.stringify(
         inertiaObject
      )
         .replaceAll("&quot;", "&#039;")
         .replace(/"/g, "&quot;")}"></div>

     <div id="toast"></div>
       
      <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
      <script type="module" src="${asset("main.js")}" defer></script>
   </body>
</html>
`;
 

            return res.type("html").send(html);
         }

         res.setHeader("Vary", "Accept");
         res.setHeader("X-Inertia", "true");
         res.setHeader("X-Inertia-Version", pkg.version);

         return res.json(inertiaObject);
      };

      next();
   };
};

export default inertia;

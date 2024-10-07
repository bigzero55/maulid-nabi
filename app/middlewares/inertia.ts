import { asset } from "../services/helper";
let pkg = require("../../package.json");

const inertia = () => {
  return (request, response, next) => {
    response.inertia = async (component, inertiaProps = {}, viewProps = {}) => {
      const url = `${request.get("host")}${request.originalUrl}`;

      let props = {
        ...inertiaProps,
        ...viewProps,
        error: null,
        user: request.user || {},
      } as any;

      if (request.cookies.error) {
        props.error = request.cookies.error;
      }

      const inertiaObject = {
        component: component,
        props: props,
        url: url,
        version: pkg.version,
      };

      if (!request.header("X-Inertia")) {
        let html = `<!DOCTYPE html>
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
                     <script type="module" src="${asset(
                       "main.js"
                     )}" defer></script>
                  </body>
               </html>
               `;

        if (process.env.NODE_ENV == "development") {
          html = html.replace(
            "</body>",
            `
      <script>
      var evtSource = new EventSource('http://localhost:8001/subscribe');
   
         evtSource.onmessage = function (event) { 
         if (event.data.includes("reload")) {
            console.log("reloaded")
            setTimeout(() => {
               location.reload();
            }, 0);
         }
      }; 
      </script>
      </body>
      `
          );
        }

        return response.type("html").send(html);
      }

      response.setHeader("Vary", "Accept");
      response.setHeader("X-Inertia", "true");
      response.setHeader("X-Inertia-Version", pkg.version);

      return response.json(inertiaObject);
    };

    next();
  };
};

export default inertia;

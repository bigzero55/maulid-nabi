import esbuild from "esbuild";
 
import svelteInertiaPlugin from "esbuild-svelte-inertia"; // https://github.com/inertiajs/inertia-svelte/tree/main/packages/esbuild-svelte-inertia
import sveltePlugin from "esbuild-svelte";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import {writeFileSync,rename} from 'fs';  

const result = await esbuild.build({ 
  entryPoints: ["./resources/js/main.js"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    minify: true,
    write : false,
    splitting: true, 
    format: 'esm',
    outdir: 'public',
  plugins: [sveltePlugin(), svelteInertiaPlugin()],
}) 

const hash = (Math.random() + 1).toString(36).substring(7);;


let manifest = `{
  "style.css" : "/style.${hash}.css",`;

  let count = 0;
  
  rename( "public/style.css", `public/style.${hash}.css`, ()=>{} )
 

  const out = result.outputFiles;
  
  for await (const file of out) {
    count++;
    const filename = file.path.split("/").pop();
 
    const split = filename.split(".")

    const ext = split.pop();

    const name = split.pop();
    
    if(name == 'main')
    {
      const hash_name = `${name}.${file.hash.replace("/","")}.${ext}`;

      manifest += `"${filename}": "/${hash_name}"${count < out.length  ? "," : ""}`
    
      writeFileSync( __dirname+`/public/${hash_name}`, file.text)

     
    }else{
      const hash_name = `${name}.${ext}`;

      manifest += `"${filename}": "/${hash_name}"${count < out.length  ? "," : ""}`
    
      writeFileSync( __dirname+`/public/${hash_name}`, file.text)
    }
    
   
  } 
  

  manifest+=`}`
 
  writeFileSync( "./public/manifest.json", manifest)
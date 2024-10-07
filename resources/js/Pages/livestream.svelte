<script>
   import axios from "axios";
   import { onDestroy, onMount } from "svelte";
   import Modal from "../Components/Modal.svelte";
 

   let like_count = 0;

   let youtube_id = "cwlNbxeUiug";

   let comments = [];

   let message = "";
  
   export let stat = {};

   export let audiences = 0;

   let message_cooldown = 0;

   let interupted_action = "Comment"

   export let submission = {}; 

   let evtSource = new EventSource("/live-chat", {
      withCredentials: false,
   });

   evtSource.onmessage = (event) => {
      if (event.data.includes("live-audience")) {
        audiences = parseInt(event.data.split(":")[1]).toLocaleString("id");
        stat.attendee_number = parseInt(event.data.split(":")[2]).toLocaleString("id");
      }

      if (event.data.includes("message")) {
         let data = JSON.parse(event.data);

         const check = comments.find((c) => c.id == data.id);

         if (check) {
            return;
         }
         comments = [...comments, data];
      }
   };

   
   onMount(() => {
      new Plyr("#player");
   });

   function Like() {
      if (!submission.name) {
         show = true;
        interupted_action = "Like"
         return;
      }

      submission.like = !submission.like;

      stat.like_number = submission.like ? stat.like_number + 1 : stat.like_number - 1;

      axios.post("/like", submission);
   }

   let show = false;

   setInterval(() => {
      message_cooldown = message_cooldown - 1;
   }, 1000);

   function SubmitAttendee() {
      axios.post("/attendee", submission).then(response=>{
        if(interupted_action == "Like"){
            Like();
        }
        if(interupted_action == "Comment"){
            SendMessage("text", message);
        }
        show = false;
      })
   }

   function SendMessage(type, content) {
      if (!submission.name) {
         show = true;
         interupted_action = "Comment"
         return;
      }

      if (message_cooldown > 0) {
         return;
      }

      let comment_data = {
         id: crypto.randomUUID(),
         author_id: submission.id,
         type: type,
         name: submission.name,
         message: content,
         time: Date.now(),
      };

      comments = [...comments, comment_data];

      axios.post("/comment", comment_data);

      message = "";

      message_cooldown = 10;
      
   }
</script>

<div class="bg-gray-800 text-gray-100">
   <div id="tutor-page-wrap" class="lg:flex w-full h-screen">
      <div
         class="tutor-video-player-wrapper lg:w-4/5 sticky top-0 z-10 bg-gray-800"
      >
         <div class="p-4 w-full">LIVE STREAMING MAULID NABI IDRIS</div>
         <div class="tutor-video-player">
            <div class="loading-spinner" area-hidden="true"></div>
            <div id="player" class="plyr__video-embed tutorPlayer">
               <!-- svelte-ignore a11y-missing-attribute -->
               <iframe
                  src="https://www.youtube.com/embed/{youtube_id}?&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                  allowfullscreen
                  allowtransparency
                  allow="autoplay"
               ></iframe>
            </div>
         </div>
         <div class="p-4 text-gray-400 flex justify-between">
            <div>{audiences} sedang menonton</div>
            <div class="flex gap-3">
               <div class="flex gap-1">
                  <button
                     on:click={() => {
                        Like();
                     }}
                     ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 {submission.like
                           ? 'text-red-500 fill-red-500'
                           : ''}"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                     </svg></button
                  >
                  {stat.like_number}
               </div>
               <div class="flex gap-1">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke-width="1.5"
                     stroke="currentColor"
                     class="w-6 h-6"
                  >
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                     />
                  </svg>

                  {stat.attendee_number}
               </div>
            </div>
         </div>
      </div>

      <!-- live chat -->
      <div class="lg:w-1/4 flex flex-col">
         <div class="p-4">Live Chat</div>
         <div class="px-4 h-full overflow-auto text-gray-300 text-sm max-h-lvh">
            <div class=" space-y-3 pb-20 lg:pb-0">
               {#each comments as item}
                  {#if item.type == "text"}
                     <div>
                        <span class="text-gray-400 font-medium"
                           >{item.name} :</span
                        >
                        {item.message}
                     </div>
                  {:else if item.type == "sticker"}
                     <div class="flex gap-1">
                        <div
                           class="flex items-center text-gray-400 font-medium"
                        >
                           {item.name} :
                        </div>
                        <img class="h-20" src={item.message} alt="" />
                     </div>
                  {:else if item.type == "order"}
                     <div
                        class="bg-yellow-600 p-3 rounded-lg text-white flex gap-3"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke-width="1.5"
                           stroke="currentColor"
                           class="w-6 h-6"
                        >
                           <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                           />
                        </svg>

                        <div class="flex items-center">
                           {item.name} telah membeli {item.product_name}
                        </div>
                     </div>
                  {/if}
               {/each}
            </div>
         </div>
         <div class="fixed w-full lg:relative bottom-0 z-10 bg-gray-800">
            <div class="p-4 flex gap-1 justify-between">
               <input
                  type="text"
                  bind:value={message}
                  on:keyup={(e) => {
                     if (e.key == "Enter") {
                        SendMessage("text", message);
                     }
                  }}
                  class="w-full bg-gray-900 px-4 py-2 outline-none rounded-md"
                  placeholder="Type your message"
               />
               <button
                  on:click={() => {
                     SendMessage("text", message);
                  }}
               >
                  {#if message_cooldown > 0}
                     {message_cooldown}
                  {:else}
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                     >
                        <path
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                     </svg>
                  {/if}
               </button>
            </div>
         </div>
      </div>
   </div>
</div>
<Modal bind:show title="Register" width="max-w-lg">
   <div class="p-4 bg-gray-900">
      <form on:submit|preventDefault={SubmitAttendee} class="max-w-sm mx-auto">
         <div class="relative z-0 w-full mb-5 group">
            <input
               type="text"
               bind:value={submission.name}
               name="name"
               id="name"
               class="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:border-blue-500 focus:outline-none focus:ring-0 peer"
               placeholder=" "
               required
            />
            <label
               for="name"
               class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
               >Name</label
            >
         </div>
         <button
            type="submit"
            class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >Submit</button
         >
      </form>
   </div>
</Modal>

<template>
  <!-- Entity Card -->
  <div
    class="absolute w-2/3 md:w-1/3 top-1/4 left-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
    <!-- Info -->
    <div v-if="showInfoForm" class="flex-grow">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
          {{ entityToShow.name }}
        </h3>
        <button @click.prevent="globalStore.showEntityCard = false" type="button"
          class="flex justify-center items-center size-6 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-expanded="false" aria-controls="close-info-card" aria-label="Close info"
          data-hs-collapse="#close-info-card">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <p class="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">
        {{ entityToShow.type }}
      </p>
      <p class="mt-2 text-gray-500 dark:text-neutral-400">
        {{ entityToShow.desc }}
      </p>
      <!-- <a class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600" href="#">
        Card link
        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </a> -->

      <!-- Rating -->
      <div class="flex items-center my-2">
        <svg
          :class="entityToShow.rating >= 1 ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-neutral-600'"
          class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
          </path>
        </svg>
        <svg
          :class="entityToShow.rating >= 2 ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-neutral-600'"
          class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
          </path>
        </svg>
        <svg
          :class="entityToShow.rating >= 3 ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-neutral-600'"
          class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
          </path>
        </svg>
        <svg
          :class="entityToShow.rating >= 4 ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-neutral-600'"
          class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
          </path>
        </svg>
        <svg
          :class="entityToShow.rating >= 5 ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-neutral-600'"
          class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
          </path>
        </svg>
      </div>
      <!-- End Rating -->

      <div v-if="reviewsToShow.length > 0">
        <h5 class="mb-1 text-base font-bold text-gray-800 dark:text-white">
          Recensioni:
        </h5>
        <div
          class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <div
            class="h-40 overflow-y-auto p-4 md:p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <!-- Chat Bubble -->
            <ul class="space-y-5">

              <!-- Chat -->
              <li 
                v-for="review in reviewsToShow"
                class="max-w-lg flex gap-x-2 sm:gap-x-4">
                <div class="grow space-y-3">
                  <!-- Card -->
                  <div
                    class="space-y-1 bg-white border border-gray-200 rounded-2xl p-4 dark:bg-neutral-900 dark:border-neutral-700">
                    <h2 class="font-bold text-gray-800 dark:text-white">
                      {{ review.uName }}
                    </h2>
                    <p class="ml-1 mb-1.5 text-sm text-gray-800 dark:text-white">
                      {{ review.comment }}
                    </p>
                  </div>
                  <!-- End Card -->
                </div>
              </li>
              <!-- End Chat -->

            </ul>
            <!-- End Chat Bubble  -->
          </div>
        </div>
      </div>

      <div class="mx-2 mt-2 flex space-x-2">
        <button class="bg-green-600 text-white font-bold py-1 px-2 rounded shadow hover:bg-green-700"
          @click="showReview">
          Aggiungi recensione
        </button>
        <button class="bg-red-600 text-white font-bold py-1 px-2 rounded shadow hover:bg-red-700"
          @click="showFeedback">
          Segnala un problema
        </button>
      </div>
      <p class="hidden w-full text-xs text-red-600 mt-2" id="login-error">Prima devi eseguire il login</p>

    </div>
    <!-- End Info -->

    <!-- Review Form -->
    <div v-if="showReviewForm"
      class="flex flex-col justify-center items-center text-gray-800 bg-white dark:bg-neutral-900 rounded-xl">
      <div class="flex justify-between items-center w-full">
        <label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Titolo</label>
        <button @click.prevent="showInfo" type="button"
          class="mb-2 flex justify-center items-center size-6 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-expanded="false" aria-controls="close-review-form" aria-label="Close review form">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <input type="text" id="input-label"
        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder="Il titolo della tua recensione..." required>
        <p class="hidden w-full text-xs text-red-600 mt-2" id="title-error">Inserisci un titolo</p>

      <!-- Textarea -->
      <div class="relative w-full mt-4">
        <label for="textarea-label" class="block text-sm font-medium mb-2 dark:text-white">Commento</label>
        <textarea id="textarea-label"
          class="max-h-36 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 resize-none overflow-y-auto"
          placeholder="La tua recensione..." rows="2" required></textarea>
          <p class="hidden w-full text-xs text-red-600 mt-2" id="comment-error">Inserisci un commento</p>

      </div>
      <!-- End Textarea -->

      <!-- Rating -->
      <div class="mt-2 flex flex-row-reverse justify-end items-center">
        <input id="hs-ratings-readonly-1" type="radio"
          class="peer -ms-5 size-5 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
          name="hs-ratings-readonly" value="1">
        <label for="hs-ratings-readonly-1"
          class="peer-checked:text-yellow-400 text-gray-300 pointer-events-none dark:peer-checked:text-yellow-600 dark:text-neutral-600">
          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
            </path>
          </svg>
        </label>
        <input id="hs-ratings-readonly-2" type="radio"
          class="peer -ms-5 size-5 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
          name="hs-ratings-readonly" value="2">
        <label for="hs-ratings-readonly-2"
          class="peer-checked:text-yellow-400 text-gray-300 pointer-events-none dark:peer-checked:text-yellow-600 dark:text-neutral-600">
          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
            </path>
          </svg>
        </label>
        <input id="hs-ratings-readonly-3" type="radio"
          class="peer -ms-5 size-5 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
          name="hs-ratings-readonly" value="3">
        <label for="hs-ratings-readonly-3"
          class="peer-checked:text-yellow-400 text-gray-300 pointer-events-none dark:peer-checked:text-yellow-600 dark:text-neutral-600">
          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
            </path>
          </svg>
        </label>
        <input id="hs-ratings-readonly-4" type="radio"
          class="peer -ms-5 size-5 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
          name="hs-ratings-readonly" value="4">
        <label for="hs-ratings-readonly-4"
          class="peer-checked:text-yellow-400 text-gray-300 pointer-events-none dark:peer-checked:text-yellow-600 dark:text-neutral-600">
          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
            </path>
          </svg>
        </label>
        <input id="hs-ratings-readonly-5" type="radio"
          class="peer -ms-5 size-5 bg-transparent border-0 text-transparent cursor-pointer appearance-none checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
          name="hs-ratings-readonly" value="5">
        <label for="hs-ratings-readonly-5"
          class="peer-checked:text-yellow-400 text-gray-300 pointer-events-none dark:peer-checked:text-yellow-600 dark:text-neutral-600">
          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
            </path>
          </svg>
        </label>
      </div>
      <!-- End Rating -->

      <!-- Button Group -->
      <div class="flex justify-between mt-4">
        <button type="button"
          @click="sendReview"
          class="py-1.5 px-3 inline-flex justify-center items-center text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:bg-green-500">
          Invia
        </button>
      </div>
    </div>
    <!-- End Review Form -->


    <!-- Feedback Form -->
    <div v-if="showFeedbackForm"
      class="flex flex-col justify-center items-center text-gray-800 bg-white dark:bg-neutral-900 rounded-xl">
      <div class="flex justify-between items-center w-full">
        <label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Titolo</label>
        <button @click.prevent="showInfo" type="button"
          class="mb-2 flex justify-center items-center size-6 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-expanded="false" aria-controls="close-review-form" aria-label="Close review form">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <input type="text" id="input-label"
        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder="Il titolo del tuo problema..."
        required>
        <p class="hidden w-full text-xs text-red-600 mt-2" id="title-error">Inserisci un titolo</p>

      <!-- Textarea -->
      <div class="relative w-full mt-4">
        <label for="textarea-label" class="block text-sm font-medium mb-2 dark:text-white">Descrizione</label>
        <textarea id="textarea-label"
          class="max-h-36 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 resize-none overflow-y-auto"
          placeholder="Descrivi il tuo problema..." rows="2" required></textarea>
          <p class="hidden w-full text-xs text-red-600 mt-2" id="desc-error">Inserisci una descrizione dettagliata del problema</p>

        <!-- Button Group -->
        <div class="flex justify-between mt-4">
          <button type="button"
            @click="sendFeedback"
            class="py-1.5 px-3 inline-flex justify-center items-center text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:bg-red-500">
            Invia
          </button>
        </div>
      </div>
      <!-- End Textarea -->
    </div>
    <!-- End Feedback Form -->
  </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/globalStore';

export default {
  name: 'EntityInfo',
  setup() {
    const globalStore = useGlobalStore();

    return { globalStore };
  },

  props: ['entityToShow', 'reviewsToShow'],

  data() {

    return { showInfoForm: true, showReviewForm: false, showFeedbackForm: false };
  },
// TODO: CHANGE LOGIN ERROR INPUT BEHAVIOR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  methods: {
    showInfo(): void {
      console.log('showInfo');
      this.showInfoForm = true;
      this.showReviewForm = false;
      this.showFeedbackForm = false;
      const textarea = document.getElementById("textarea-label") as HTMLTextAreaElement;
      if (textarea.value !== "") {
        textarea.value = "";
      }
    },

    showReview(): void {
      if(!this.globalStore.isLoggedIn) {
        document.getElementById("login-error")?.classList.remove("hidden");
        return;
      } else {
        document.getElementById("login-error")?.classList.add("hidden");
      }
      console.log('addReview');
      this.showReviewForm = true;
      this.showInfoForm = false;
    },

    showFeedback(): void {
      if(!this.globalStore.isLoggedIn) {
        document.getElementById("login-error")?.classList.remove("hidden");
        return;
      } else {
        document.getElementById("login-error")?.classList.add("hidden");
      }
      console.log('addFeedback');
      this.showFeedbackForm = true;
      this.showInfoForm = false;
    },

    async sendReview() {
      console.log('sendReview');
      if ((document.getElementById("input-label") as HTMLInputElement)?.value == "") {
        document.getElementById("title-error")?.classList.remove("hidden");
        return;
      } else {
        document.getElementById("title-error")?.classList.add("hidden");
      }
      
      if ((document.getElementById("textarea-label") as HTMLTextAreaElement)?.value == "") {
        document.getElementById("comment-error")?.classList.remove("hidden");
        return;
      } else {
        document.getElementById("comment-error")?.classList.add("hidden");
      }

      let rating = 0;
      if ((document.getElementById("hs-ratings-readonly-5") as HTMLInputElement)?.checked == true) {
        rating = 5;
      } else if ((document.getElementById("hs-ratings-readonly-4") as HTMLInputElement)?.checked == true) {
        rating = 4;
      } else if ((document.getElementById("hs-ratings-readonly-3") as HTMLInputElement)?.checked == true) {
        rating = 3;
      } else if ((document.getElementById("hs-ratings-readonly-2") as HTMLInputElement)?.checked == true) {
        rating = 2;
      } else if ((document.getElementById("hs-ratings-readonly-1") as HTMLInputElement)?.checked == true) {
        rating = 1;
      }

      try {
        console.log("Bearer " + this.globalStore.token);
          const response = await fetch("https://improved-bright-alien.ngrok-free.app/reviews/" + this.entityToShow.eid, {
              method: "POST",
              headers: {
                  "ngrok-skip-browser-warning": "any",
                  "Content-Type": "application/json",
                  "authorization": "Bearer " + this.globalStore.token,
              },
              body: JSON.stringify({
                rating: rating,
                comment: (document.getElementById("textarea-label") as HTMLTextAreaElement)?.value,
              })
          });
          const resp = await response.json();
          console.log(resp);
      } catch (error) {
          console.log(error);
      }

    },

    sendFeedback(): void {
      console.log('sendFeedback');
    }
  }
};
</script>
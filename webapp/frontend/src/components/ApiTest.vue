<template>
    <div class="mt-40">
        <form>
            <div class="m-5">
                <label for="hs-trailing-button-add-on-with-leading-and-trailing" class="sr-only">Label</label>
                <div class="flex rounded-lg shadow-sm">
                <span class="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                    <span class="text-sm text-gray-500 dark:text-neutral-400">https://</span>
                </span>
                <input type="text" 
                    v-model="urlAPI"
                    id="hs-trailing-button-add-on-with-leading-and-trailing" name="hs-trailing-button-add-on-with-leading-and-trailing" class="bg-[#EDF1D6] py-3 px-4 block w-full border-gray-200 shadow-sm rounded-0 text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                <button type="button" class="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="testApi"
                >
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                    </svg>
                </button>
                </div>
            </div>
        </form>
        <p class="m-5">
            {{ response }}
        </p>
    </div>
</template>

<script lang="ts">

    export default {
        data() {
            return {
                response: '',
                urlAPI: ''
            }
        },
        methods: {
            async testApi() {
                fetch(`http://${this.urlAPI}`)
                    .then(response => response.text())
                    .then(data => {
                        console.log(data)
                        this.response = data
                    })
                    .catch(error => {
                        console.error('Error:', error)
                        this.response = JSON.stringify(error)
                    })
            }
        },
    }
</script>
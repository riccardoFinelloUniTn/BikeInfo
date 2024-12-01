<template>
    <!-- Hero -->
    <div class="pt-10 bg-gradient-to-b from-violet-600/10 via-transparent">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
            <!-- Announcement Banner -->
            <!-- <div class="flex justify-center">
            <a class="group inline-flex items-center bg-white/10 hover:bg-white/10 border border-white/10 p-1 ps-4 rounded-full shadow-md focus:outline-none focus:bg-white/10" href="../figma.html">
                <p class="me-2 text-white text-sm">
                Preline UI Figma is live.
                </p>
                <span class="group-hover:bg-white/10 py-1.5 px-2.5 flex justify-center items-center gap-x-2 rounded-full bg-white/10 font-semibold text-white text-sm">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
            </a>
            </div> -->
            <!-- End Announcement Banner -->

            <!-- Title -->
            <div class="max-w-3xl text-center mx-auto">
            <h1 class="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Ottimizza i tuoi spostamenti a Trento
            </h1>
            </div>
            <!-- End Title -->

            <div class="max-w-3xl text-center mx-auto">
            <p class="text-lg text-white/70">InfoBike è un progetto sviluppato da Francesco Fanton, Matteo Ballardin e Riccardo Finello durante il corso di Ingegneria del software presso l'Università di Trento.</p>
            </div>

            <!-- Buttons -->
            <div class="text-center">
            <a 
                @click.prevent="goToMap()"
                class="cursor-pointer inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-green-700 to-green-850 shadow-lg shadow-transparent hover:shadow-green-700/50 border border-transparent text-sm font-medium rounded-full focus:outline-none focus:shadow-green-700/50 py-3 px-6">
                Provalo subito
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            </div>
            <!-- End Buttons -->
        </div>
    </div>
    <!-- End Hero -->
</template>

<script lang="ts">
    export default{
        name: 'Index',
        props: ['goToMap'],
    }
</script>
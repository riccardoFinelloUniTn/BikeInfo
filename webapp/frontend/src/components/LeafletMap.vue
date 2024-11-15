<template>
    <div>
        <h3  class="pt-5">An interactive leaflet map</h3>
        <div id="map" style="height:500px; width: 500px; margin-left: 25%;"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import "leaflet/dist/leaflet.css";
    import * as L from 'leaflet';

    const initialMap = ref();

    onMounted(()=> {
        initialMap.value = L.map('map').setView([46.074779, 11.121749], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(initialMap.value);
    });
</script>
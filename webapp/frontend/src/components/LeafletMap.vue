<template>
    <div class="pt-14">
        <div id="map" class="mx-auto mt-10" style="height:500px; width: 500px;"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import "leaflet/dist/leaflet.css";
    import L from 'leaflet';

    const initialMap = ref();

    onMounted(()=> {
        initialMap.value = L.map('map').setView([46.074779, 11.121749], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(initialMap.value);

        if(!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                initialMap.value.setView([latitude, longitude], 16);
                var marker = L.marker([latitude, longitude]);
                marker.bindPopup('Tu sei qui!').openPopup();
                marker.addTo(initialMap.value);
            }, () => {
                alert('Unable to retrieve your location');
            });
        }
        
    });
</script>
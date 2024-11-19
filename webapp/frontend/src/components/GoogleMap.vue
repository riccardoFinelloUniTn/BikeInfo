<template>
    <GoogleMap
      :api-key="API_KEY"
      class="mx-auto h-[950px] w-[100%]"
      :center="center"
      :zoom="15"
      map-id='8234d4630643e2e3'
    >
      <Marker :options="{ position: center }" />
    </GoogleMap>
  </template>

<script lang="ts">

import { GoogleMap, Marker } from "vue3-google-map";
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default {
  name: "App",
  components: { GoogleMap, Marker },
  data() {
    const center = { lat: 46.06733703613281, lng: 11.121463775634766 };
    return { center, API_KEY };
  },
};
</script>
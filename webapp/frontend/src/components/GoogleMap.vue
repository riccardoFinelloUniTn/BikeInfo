<template>
  <div class="h-screen w-screen relative">
    <GoogleMap
      ref="mapRef"
      :api-key="API_KEY" 
      class="mx-auto h-full w-full" 
      :center="center" 
      :zoom="zoom" 
      map-id="8234d4630643e2e3"
      :mapTypeControl=false 
      :scaleControl=false 
      :zoomControl=false 
      :streetViewControl=false 
      :fullscreenControl=true
      fullscreen-control-position="RIGHT_BOTTOM"
    >
      <MarkerCluster>
        <AdvancedMarker
          v-for="(location, i) in locations"
          :key="i"
          :options="{ position: location }"
        />
      </MarkerCluster>
      <CustomControl 
        position="RIGHT_BOTTOM"
        class="mb-5 mr-2"
        >
        <button
          class="bg-green-700 p-2 rounded shadow-transparent hover:shadow-green-700/50" 
          @click="panMapTo($refs.mapRef)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/></svg>
        </button>
      </CustomControl>
    </GoogleMap>
    <!-- <button
      @click="panMapTo($refs.mapRef)"
      class="absolute top-16 right-4 bg-white p-2 rounded shadow-md hover:bg-gray-100"
    >Get Center</button> -->
  </div>
</template>

<script lang="ts">

  import { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow, CustomControl } from "vue3-google-map";
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  import proj4 from 'proj4';


  // Sistema di partenza (EPSG:25832)
  // urn:ogc:def:crs:EPSG::25832
  proj4.defs(
    "EPSG:25832",
    "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs"
  );

  export default {
    
    components: { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow, CustomControl },

    props: ['rastLocs'],

    data() {
      const locations: Array<{lat: number, lng: number}> = [];
      const zoom = 18;
      const center = { lat: 46.06733703613281, lng: 11.121463775634766 };
      

      let rast = Object.assign({}, JSON.parse(this.rastLocs));
      console.log(rast);

      rast.features.forEach((element: any) => {
        // Coordinate in EPSG:25832
        // Calcolo il punto medio tra i due punti
        let utmCoordinates = [(element.geometry.coordinates[0][0] + element.geometry.coordinates[1][0])/2, 
                              (element.geometry.coordinates[0][1] + element.geometry.coordinates[1][1])/2];

        // Trasforma le coordinate da EPSG:25832 a EPSG:4326 (WGS84) (lat, long)
        let latLng = proj4("EPSG:25832", "EPSG:4326", utmCoordinates);

        let pos = { lat: latLng[1], lng: latLng[0] };
        locations.push(pos);
      
      });



      return { center, API_KEY, locations, zoom };
    },
    // onMounted() {
    //   const mapRef: any = this.$refs.mapRef;

    //   mapRef.map.setOptions({
    //     FullScreenControlOptions: {
    //       position: GoogleMap.ControlPosition.RIGHT_BOTTOM
    //     }
    //   });
    // },
    methods: {
      // getCenter() {
      //   if(navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(
      //       (position: GeolocationPosition) => {
      //           this.center = {
      //           lat: position.coords.latitude,
      //           lng: position.coords.longitude,
      //         };
      //       },
      //       () => {
      //         console.log("Error in the geolocation service.");
      //       }
      //     );
      //   } else {
      //     console.log("Browser does not support geolocation.");
      //   }
      // },
      
      panMapTo(mapRef: any) {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            // Success
            (position: GeolocationPosition) => {
              mapRef.map.panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              mapRef.map.setZoom(18);
            },
            // Error
            () => {
              console.log("Error in the geolocation service.");
            },
            // Options
            {
              enableHighAccuracy: false,
              timeout: 5000
            }
          );
        } else {
          console.log("Browser does not support geolocation.");
        }
      }
    }
  };
</script>
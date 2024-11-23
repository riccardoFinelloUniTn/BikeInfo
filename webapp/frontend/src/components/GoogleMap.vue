<template>
  <div class="h-screen w-screen relative">
    <GoogleMap
      ref="mapRef"
      :api-key="API_KEY" 
      class="mx-auto h-full w-full" 
      :center="center" 
      :zoom="18" 
      map-id="8234d4630643e2e3"
      :mapTypeControl=false 
      :scaleControl=false 
      :zoomControl=false 
      :streetViewControl=false 
      :fullscreenControl=false
    >
      <MarkerCluster>
        <AdvancedMarker
          v-for="(location, i) in locations"
          :key="i"
          :options="{ position: location }"
        />
      </MarkerCluster>
    </GoogleMap>
    <div class="absolute top-16 right-4 text-black bg-[#EDF1D6] p-2 rounded shadow-md hover:bg-gray-100">
      <button 
        @click="panMapTo($refs.mapRef)"
      >Center</button>
    </div>
    <!-- <button
      @click="panMapTo($refs.mapRef)"
      class="absolute top-16 right-4 bg-white p-2 rounded shadow-md hover:bg-gray-100"
    >Get Center</button> -->
  </div>
</template>

<script lang="ts">

  import { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow } from "vue3-google-map";
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  import proj4 from 'proj4';


  // Sistema di partenza (EPSG:25832)
  // urn:ogc:def:crs:EPSG::25832
  proj4.defs(
    "EPSG:25832",
    "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs"
  );

  export default {
    
    components: { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow},

    props: ['rastLocs'],

    data() {
      const locations: Array<{lat: number, lng: number}> = [];

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


      const center = { lat: 46.06733703613281, lng: 11.121463775634766 };
      

      return { center, API_KEY, locations };
    },
    
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
          navigator.geolocation.watchPosition(
            // Success
            (position: GeolocationPosition) => {
                mapRef.map.panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            // Error
            () => {
              console.log("Error in the geolocation service.");
            },
            // Options
            {
              enableHighAccuracy: true
            }
          );
        } else {
          console.log("Browser does not support geolocation.");
        }
      }
    }
  };
</script>
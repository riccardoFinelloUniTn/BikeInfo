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
      fullscreen-control-position="RIGHT_CENTER"
      fullscreen-control-options
      @zoom_changed="updateCircleRadius()"
    >
      <MarkerCluster>
        <AdvancedMarker
          v-for="(location, i) in locations"
          :key="i"
          :options="{ position: location }"
        />
      </MarkerCluster>

      <Circle
        v-if="globalStore.$state.userLatLng.lat != 0"
        zIndex="999"
        :options="{ center: globalStore.$state.userLatLng, radius: userCircleRadius, strokeColor: '#FFFFFF', strokeOpacity: 1, strokeWeight: 2, fillColor: '#4285F4', fillOpacity: 1 }"
      />
      <Circle
        v-if="globalStore.$state.userLatLng.lat != 0"
        zIndex="998"
        :options="{ center: globalStore.$state.userLatLng, radius: globalStore.$state.rangeError, strokeColor: '#4285F4', strokeOpacity: 0.5, strokeWeight: 2, fillColor: '#4285F4', fillOpacity: 0.15 }"
      />
      <CustomControl 
        position="RIGHT_CENTER"
        class="mr-2.5"
        >
        <button
          class="p-2 rounded shadow-sm shadow-black/30 text-black bg-white" 
          @click="panMap()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/></svg>
        </button>
      </CustomControl>
      <!-- FILTERS  -->
      <CustomControl
        position="BOTTOM_CENTER"
        class="mb-3.5 mr-1.5 ml-1.5"
      >
        <button
          class="p-2 rounded shadow-sm shadow-black/30 text-black bg-white" 
          @click="loadRacks()"
        >
          <img src="../assets/rack.png" alt="Rastrelliere" class="w-6 h-6">
        </button> 
      </CustomControl>
      <CustomControl
        position="BOTTOM_CENTER"
        class="mb-3.5 mr-1.5 ml-1.5"
      >
        <button
          class="p-2 rounded shadow-sm shadow-black/30 text-black bg-white" 
          @click="loadParkings()"
        >
          <img src="../assets/parking.png" alt="Rastrelliere" class="w-6 h-6">
        </button> 
      </CustomControl>
    </GoogleMap>
  </div>
</template>

<script lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow, CustomControl, Circle } from "vue3-google-map";
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  import proj4 from 'proj4';
  import { useGlobalStore } from "@/globalStore";


  // Sistema di partenza (EPSG:25832)
  // urn:ogc:def:crs:EPSG::25832
  proj4.defs(
    "EPSG:25832",
    "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs"
  );
  

  export default {
  
    setup() {
      const globalStore = useGlobalStore();

      onMounted(() => {
        globalStore.updateUserPos();
      });

      onUnmounted(() => {
        globalStore.clearWatch();
      });

      return { globalStore };
    },

    // created() {
    //   window.addEventListener('beforeunload', this.onRefresh);
    // },

    components: { GoogleMap, AdvancedMarker, MarkerCluster, InfoWindow, CustomControl, Circle },

    // mounted() {
    //   this.updateUserLoc();
    // },

    

    computed: {
      isDarkMode() {
        return (document.querySelector('html') as any).classList.contains('dark');
      }
    },
    
    data() {
      const globalStore = useGlobalStore();
      const locations: Array<{lat: number, lng: number}> = [];
      const zoom = 18;
      const center = globalStore.$state.userLatLng;
      const userCircleRadius = this.calculateRadius(zoom);

      this.updateMarkers();
      // const rast = Object.assign({}, this.rastLocs);
      // const updatedRangeError = this.rangeError;
      // const updatedUsrLatLang = this.userLatLng;

      

      // const darkMap = [
      //   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      //   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      //   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      //   {
      //     featureType: "administrative.locality",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "poi",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "poi.park",
      //     elementType: "geometry",
      //     stylers: [{ color: "#263c3f" }],
      //   },
      //   {
      //     featureType: "poi.park",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#6b9a76" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "geometry",
      //     stylers: [{ color: "#38414e" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "geometry.stroke",
      //     stylers: [{ color: "#212a37" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#9ca5b3" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "geometry",
      //     stylers: [{ color: "#746855" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "geometry.stroke",
      //     stylers: [{ color: "#1f2835" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#f3d19c" }],
      //   },
      //   {
      //     featureType: "transit",
      //     elementType: "geometry",
      //     stylers: [{ color: "#2f3948" }],
      //   },
      //   {
      //     featureType: "transit.station",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "geometry",
      //     stylers: [{ color: "#17263c" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#515c6d" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "labels.text.stroke",
      //     stylers: [{ color: "#17263c" }],
      //   },
      // ];
    
      return { API_KEY, locations, zoom, userCircleRadius, center };
      // return { center, API_KEY, locations, zoom, updatedRangeError, userCircleRadius, updatedUsrLatLang};
    },



    methods: {

      onRefresh(){
        this.globalStore.clearWatch();
        this.$router.push('/');
      },

      async loadParkings() {
        const response = await this.globalStore.getApiData("parcheggiProtetti");
        console.log(response);
        if (!response.success) {
          console.log("Server error");
          this.globalStore.$state.showMap = false;
          this.$router.push('/serverError');
        }
        this.updateMarkers();
      },

      async loadRacks() {
        const response = await this.globalStore.getApiData("rastrelliere");
        if (!response.success) {
          console.log("Server error");
          this.globalStore.$state.showMap = false;
          this.$router.push('/serverError');
        }
        this.updateMarkers();
      },

      panMap(){
        if (this.globalStore.$state.userLatLng.lat == 0) {
          this.globalStore.getUserPos();
        }
        const map = (this.$refs.mapRef as any).map;
        map.panTo(this.globalStore.$state.userLatLng);
        this.updateCircleRadius();
        map.setZoom(17);
        this.updateCircleRadius();

      },

      updateMarkers(){
        this.locations = [];
        // Per ogni entità, calcola il punto medio tra i due punti e lo trasforma in latitudine e longitudine
        (this.globalStore.$state.apiData as any).data.forEach((element: any) => {
          // Coordinate in EPSG:25832
          let utmCoordinates = [0, 0];
          // Calcolo il punto medio tra i due punti
          if (element.geolocation.length != 1) {
            utmCoordinates = [(element.geolocation[0][0] + element.geolocation[1][0])/2, 
                                (element.geolocation[0][1] + element.geolocation[1][1])/2];
          } else {
            utmCoordinates = element.geolocation[0];
          }
          console.log(utmCoordinates);
          // Trasforma le coordinate da EPSG:25832 a EPSG:4326 (WGS84) (lat, long)
          let latLng = proj4("EPSG:25832", "EPSG:4326", utmCoordinates);

          let pos = { lat: latLng[1], lng: latLng[0] };
          this.locations.push(pos);
        
        });
      },
      

      // updateUserLoc() {
      //   // const map = (this.$refs.mapRef as any).map;
      //   // map.panTo(this.updatedUsrLatLang);
      //   // map.setZoom(18);
      //   const id = navigator.geolocation.watchPosition(
      //     // Success
      //     (position: GeolocationPosition) => {


      //       this.globalStore.$state.rangeError = position.coords.accuracy;
      //       this.globalStore.$state.userLatLng = {
      //         lat: position.coords.latitude,
      //         lng: position.coords.longitude,
      //       };
            
      //     },
      //     // Error
      //     () => {
      //       console.log("Error in the geolocation service.");
      //     },
      //     // Options
      //     {
      //       enableHighAccuracy: true,
      //       timeout: 1000,
      //     }
      //   );
      // },

      calculateRadius(zoom: number) {
        return 6 * Math.pow(2, 18 - zoom);
      },

      updateCircleRadius() {
        const map = (this.$refs.mapRef as any).map;
        this.userCircleRadius = this.calculateRadius(map.getZoom());
      },
    }
  };
</script>
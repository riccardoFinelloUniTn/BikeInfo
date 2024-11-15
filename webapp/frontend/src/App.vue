<template>
    <navbar
        :pages="pages"
        :activePage="activePage"
        :nav-link-click="(index: number) => activePage = index"
    ></navbar>

    <page-viewer 
        :page="pages[activePage]"
    ></page-viewer>

    <leaflet-map
        v-if="activePage == 1"
    ></leaflet-map>

    <api-test
        v-if="activePage == 2"
    ></api-test>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { type IStaticMethods } from "preline/preline";

  onMounted(() => {
    setTimeout(() => {
      window.HSStaticMethods.autoInit();
    }, 100)
  });
</script>

<script lang="ts">
  declare global {
    interface Window {
      HSStaticMethods: IStaticMethods;
    }
  }
  
  import LeafletMap from './components/LeafletMap.vue';
  import Navbar from './components/Navbar.vue';
  import PageViewer from './components/PageViewer.vue';
  import ApiTest from './components/ApiTest.vue';

  export default {
      components: {
          Navbar,
          PageViewer,
          LeafletMap,
          ApiTest
      },
      data() {
          return {
              activePage: 0,
              pages: [
                  {
                      link: {text: 'Home', url: 'index.html'},
                      pageTitle: 'Home Page',
                      content: 'This is the home page.'
                  },
                  {
                      link: {text: 'Map', url: 'map.html'},
                      pageTitle: 'Map Page',
                      content: 'This is the map page.'
                  },
                  {
                      link: {text: 'API', url: 'api.html'},
                      pageTitle: 'Api Page',
                      content: 'This is the api test page.'
                  },
                  // {
                  //     link: {text: 'Services', url: 'services.html'},
                  //     pageTitle: 'Services Page',
                  //     content: 'This is the'
                  // }
              ]
          };
      },
  };
</script>

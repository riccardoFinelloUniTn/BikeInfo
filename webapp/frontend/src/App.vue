<template>
    <div class="app-container">
        <navbar 
            :pages="pages" 
            :activePage="activePage" 
            :nav-link-click="(index: number) => (activePage = index)">
        </navbar>

        <div class="content">
            <index 
                v-if="activePage == 0" 
                :go-to-map="() => (activePage = 1)"
            ></index>

            <google-map 
                v-if="activePage == 1"
                :rastLocs="rastrelliere"
            ></google-map>

            <api-test 
                v-if="activePage == 2"
            ></api-test>
            <!-- 
                <page-viewer 
                    :page="pages[activePage]"
                ></page-viewer> -->
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { type IStaticMethods } from 'preline/preline'
import GoogleMap from './components/GoogleMap.vue'
import Navbar from './components/Navbar.vue'
//   import PageViewer from './components/PageViewer.vue';
import ApiTest from './components/ApiTest.vue'
import Index from './components/Index.vue'

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods
    }
}

export default {
    setup() {
        onMounted(() => {
            setTimeout(() => {
                window.HSStaticMethods.autoInit()
            }, 100)
        })
    },
    components: {
        Navbar,
        //   PageViewer,
        GoogleMap,
        ApiTest,
        Index,
    },
    computed: {
        
    },
    data() {
        return {
            rastrelliere: [],
            activePage: 0,
            pages: [
                {
                    link: { text: 'Home', url: 'index.html' },
                    pageTitle: 'Home Page',
                    content: 'This is the home page.',
                },
                {
                    link: { text: 'Map', url: 'map.html' },
                    pageTitle: 'Map Page',
                    content: 'This is the map page.',
                },
                {
                    link: { text: 'Login/Register', url: 'api.html' },
                    pageTitle: 'Api Page',
                    content: 'This is the api test page.',
                },
                // {
                //     link: {text: 'Services', url: 'services.html'},
                //     pageTitle: 'Services Page',
                //     content: 'This is the'
                // }
            ],
        }
    },
    async mounted() {
        this.rastrelliere = await this.getRastrelliere();
    },
    methods: {
        async getRastrelliere() {
        try {
            let response = await fetch("https://improved-bright-alien.ngrok-free.app/rastrelliere", {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "any"
                },
            });
            console.log("-20$ dal conto");
            let data = await response.json();
            return data;
        } catch (error) {
            return "ERROR: " + JSON.stringify(error);
        }
        }
    }
}
</script>

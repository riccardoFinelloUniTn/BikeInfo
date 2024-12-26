<template>
    <div class="h-full w-full">
        <navbar 
            :pages="globalStore.pages" 
            :activePage="globalStore.activePage"
        >
        </navbar>

        <router-view></router-view>

        <!-- 
            <div class="content">
                <RouterView
                    v-if="activePage == 0" 
                    :go-to-map="async () => {
                        if (showMap){
                            await panToUser();
                            $router.push(pages[1].link.url);
                        } else {
                            $router.push('/serverError');
                        }
                    }"
                ></RouterView>

                <RouterView
                    v-if="activePage == 1 && rangeError != 0"
                    :rastLocs="rastrelliere"
                    :userLatLng="userLatLng"
                    :rangeError="rangeError"
                ></RouterView>

                <RouterView
                    v-if="activePage == 2"
                ></RouterView>
            </div> 
        -->
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { type IStaticMethods } from 'preline/preline'
import { useGlobalStore } from '@/globalStore'
import Navbar from './components/Navbar.vue'
// import GoogleMap from './views/GoogleMap.vue'
// import Index from './views/Index.vue'
// import RegLogController from './views/RegLogView.vue'

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
        });

        const globalStore = useGlobalStore();

        globalStore.checkIfLoggedIn();
        globalStore.updatePages();

        return { globalStore };
    },
    // computed: {
    //     ...mapStores(useGlobalStore),
    // },
    components: {
        Navbar,
        // GoogleMap,
        // Index,
        // RegLogController,
    },
    data() {
        return {
            // showMap: true,
            // rangeError: 0,
            // userLatLng: {
            //     lat: 0,
            //     lng: 0,
            // },
            // rastrelliere: {},
            // activePage: 0,
            // pages: [
            //     {
            //         link: { text: 'Home', url: '/index' },
            //         pageTitle: 'Home Page',
            //         content: 'This is the home page.',
            //     },
            //     {
            //         link: { text: 'Map', url: '/map' },
            //         pageTitle: 'Map Page',
            //         content: 'This is the map page.',
            //     },
            //     {
            //         link: { text: 'Login/Register', url: '/login' },
            //         pageTitle: 'Login Page',
            //         content: 'This is the login page.',
            //     }
            // ],
        }
    },

    async mounted() {

        const response = await this.globalStore.getApiData("parcheggiProtetti");
        
        if (!response.success) {
            this.globalStore.showMap = false;
            console.log("Server error");
        }
        // try {
        //     const response = await this.getRastrelliere();
        //     console.log(this.rastrelliere);

        //     this.rastrelliere = JSON.stringify(response);
        //     console.log(this.rastrelliere);

        //     if (!response.success) {
        //         this.showMap = false;
        //         console.log("Server error");
        //     }
        // } catch (error) {
        //     this.showMap = false;
        //     console.log("Error in the API call.");
        // }
    },

    methods: {

        
        // panToUser(): Promise<GeolocationPosition> {
        //     return new Promise((resolve, reject) => {
        //         navigator.geolocation.getCurrentPosition(
        //             // Success
        //             (position: GeolocationPosition) => {
        //                 this.rangeError = position.coords.accuracy;
        //                 this.userLatLng = {
        //                     lat: position.coords.latitude,
        //                     lng: position.coords.longitude,
        //                 };
        //                 resolve(position);
        //             },
        //             // Error
        //             () => {
        //                 console.log("Error in the geolocation service.");
        //                 reject();
        //             },
        //             // Options
        //             {
        //                 enableHighAccuracy: false
        //             }
        //         );
        //     });
        // },

        // // API CALLS
        // async getRastrelliere() {
        //     try {
        //         const response = await fetch("https://improved-bright-alien.ngrok-free.app/rastrelliere", {
        //             method: "GET",
        //             headers: {
        //                 "ngrok-skip-browser-warning": "any"
        //             },
        //         });
        //         const data = await response.json();
        //         return data;
        //     } catch (error) {
        //         return false;
        //     }
        // }
    }
}
</script>

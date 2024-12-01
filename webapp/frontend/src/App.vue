<template>
    <div class="h-full w-full">
        <navbar 
            :pages="pages" 
            :activePage="activePage" 
            :nav-link-click="async (index: number) => {
                // activePage = index;
                $router.push(pages[index].link.url);
                index == 1 ? await panToUser() : null;
            }">
        </navbar>

        <div class="content">
            <RouterView
                v-if="activePage == 0" 
                :go-to-map="async () => {
                    await panToUser();
                    $router.push(pages[1].link.url);
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
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { type IStaticMethods } from 'preline/preline'
import GoogleMap from './components/GoogleMap.vue'
import Navbar from './components/Navbar.vue'
import Index from './components/Index.vue'
import RegLogController from './components/RegLogController.vue'
import { RouterView } from 'vue-router'

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
        GoogleMap,
        Index,
        RegLogController,
    },
    data() {

        return {
            rangeError: 0,
            userLatLng: {
                lat: 0,
                lng: 0,
            },
            rastrelliere: [],
            activePage: 0,
            pages: [
                {
                    link: { text: 'Home', url: '/' },
                    pageTitle: 'Home Page',
                    content: 'This is the home page.',
                },
                {
                    link: { text: 'Map', url: '/map' },
                    pageTitle: 'Map Page',
                    content: 'This is the map page.',
                },
                {
                    link: { text: 'Login/Register', url: '/login' },
                    pageTitle: 'Login Page',
                    content: 'This is the login page.',
                }
            ],
        }
    },
    async mounted() {
        try {
            this.rastrelliere = await this.getRastrelliere();
        } catch (error) {
            console.error("Failed to fetch rastrelliere:", error);
            if ((error as any).message.includes("500")) {
                this.activePage = 0; // Stay on the current page if server error occurs
            }
        }
    },

    methods: {
        panToUser(): Promise<GeolocationPosition> {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    // Success
                    (position: GeolocationPosition) => {
                        this.rangeError = position.coords.accuracy;
                        this.userLatLng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        resolve(position);
                    },
                    // Error
                    () => {
                        console.log("Error in the geolocation service.");
                        reject();
                    },
                    // Options
                    {
                        enableHighAccuracy: false
                    }
                );
            });
        },


        // API CALLS
        async getRastrelliere() {
            try {
                let response = await fetch("https://improved-bright-alien.ngrok-free.app/rastrelliere", {
                    method: "GET",
                    headers: {
                        "ngrok-skip-browser-warning": "any"
                    },
                });
                let data = await response.json();
                return data;
            } catch (error) {
                return "ERROR: " + JSON.stringify(error);
            }
        }
    }
}
</script>

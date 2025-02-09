<template>
    <!-- Profile -->
    <div class="w-full mt-36">
        <h1 class="font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl p-5"
        > 
            Bentornato {{ globalStore.userInfo.name }}
        </h1>

        <div class="max-w-3xl text-left mx-auto">
            <p class="text-lg text-white/70">Benvenuto nel tuo profilo personale. Da qui puoi visualizzare e modificare le tue informazioni personali.</p>
            <p class="text-lg text-white/70">Email:  {{ globalStore.userInfo.email }}.</p>
        </div>

        <div class="mt-10 text-center">
            <button 
                @click="logout()" 
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    
    </div>
    <!-- End About -->
</template>

<script lang="ts">
    import { useGlobalStore } from '@/globalStore';

    export default{

        name: 'Profile',

        setup(){
            return { globalStore: useGlobalStore() };
        },

        data(){
            return {};
        },

        methods: {
            logout(){
                this.globalStore.logout();
                this.$router.push("/index");
            }
        }
    }
</script>
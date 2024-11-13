<template>
    <navbar
        :pages="pages"
        :activePage="activePage"
        :nav-link-click="(index: number) => activePage = index"
    ></navbar>

    <page-viewer 
        :page="pages[activePage]"
    ></page-viewer>

    <leaflet-map>    </leaflet-map>
    

</template>

<script lang="ts">
    import LeafletMap from './components/LeafletMap.vue';
    import Navbar from './components/Navbar.vue';
    import PageViewer from './components/PageViewer.vue';

    export default {
        components: {
            Navbar,
            PageViewer,
            LeafletMap
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
                        link: {text: 'About', url: 'about.html'},
                        pageTitle: 'About Page',
                        content: 'This is the about page.'
                    },
                    {
                        link: {text: 'Contact', url: 'contact.html'},
                        pageTitle: 'Contact Page',
                        content: 'This is the contact page.'
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
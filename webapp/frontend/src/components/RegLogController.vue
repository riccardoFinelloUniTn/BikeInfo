<template>
    <login
        v-if="isLoginPage"
        :login-or-register="(page: boolean) => isLoginPage = page"
        :global-login="login"
    ></login>

    <register
        v-else
        :login-or-register="(page: boolean) => isLoginPage = page"
        :global-login="login"
    ></register>
</template>

<script lang="ts">

    import Login from './Login.vue'
    import Register from './Register.vue'

    export default {
        name: 'RegLogController',

        components: {
            Login,
            Register,
        },
        
        data(){
            return {
                isLoginPage: true,
            }
        },
        methods: {
            async login(email: string, password: string, remember: boolean){
                try {
                    await fetch("https://improved-bright-alien.ngrok-free.app/auth", {
                        method: "POST",
                        headers: {
                            "ngrok-skip-browser-warning": "any",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            if (remember) {
                                localStorage.setItem("token", data.token);
                            } else {
                                sessionStorage.setItem("token", data.token);
                            }
                        } else {
                            return data;
                        }
                    });
                } catch (error) {
                    console.log("ERROR: " + JSON.stringify(error));
                    return "Error: " + error;
                }
            }
        }
    }
</script>
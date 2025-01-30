import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({

        serverAddress: "https://improved-bright-alien.ngrok-free.app",
        showMap: true,
        rangeError: 0,
        userLatLng: {
            lat: 0,
            lng: 0,
        },
        showEntityCard: false,

        isLoggedIn: false,
        userInfo: null as any,
        token: "",

        apiData: null,
        activePage: 0,
        watchId: null as number | null,
        pages: [
            {
                link: { text: 'Home', url: '/index' },
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
            },
        ] as Array<any>,
    }),

    
    actions: {
        logout() {
            localStorage.removeItem("token");
            this.checkIfLoggedIn;
        },

        async updateUserPos(): Promise<GeolocationPosition> {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    console.log("Geolocation is not supported by your browser.");
                    this.showMap = false;
                    reject();
                }
                else if (!this.showMap) {
                    console.log("Map is not visible.");
                    reject();
                } else {
                    this.watchId = navigator.geolocation.watchPosition(
                        // Success
                        (position: GeolocationPosition) => {
                            this.rangeError = position.coords.accuracy;
                            this.userLatLng = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            console.log("User position updated.");
                            resolve(position);
                        },
                        // Error
                        () => {
                            console.log("Error in the geolocation service.");
                            this.showMap = false;
                            reject();
                        },
                        // Options
                        {
                            enableHighAccuracy: true
                        }
                    );
                }
            });
        },

        async getUserPos(): Promise<GeolocationPosition> {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    console.log("Geolocation is not supported by your browser.");
                    this.showMap = false;
                    reject();
                } else {
                    console.log("Getting user position...");
                    navigator.geolocation.getCurrentPosition(
                        // Success
                        (position: GeolocationPosition) => {
                            this.rangeError = position.coords.accuracy;
                            this.userLatLng = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            console.log("User position given.");
                            resolve(position);
                        },
                        // Error
                        () => {
                            console.log("Error in the geolocation service.");
                            this.showMap = false;
                            reject();
                        },
                        // Options
                        {
                            enableHighAccuracy: false
                        }
                    );
                }
            });
        },

        clearWatch(): void {
            if (this.watchId != null) {
              navigator.geolocation.clearWatch(this.watchId);
              console.log("Geolocation watch cleared.");
            }
        },

        async isTokenValid(): Promise<any> {
            try {
                const response = await fetch(this.serverAddress + "/islogged", {
                    method: "GET",
                    headers: {
                        "ngrok-skip-browser-warning": "any",
                        "authorization": "Bearer " + localStorage.getItem("token"),
                    },
                });
                const resp = await response.json();
                // console.log(resp);
                return resp;
            } catch (error) {
                return false;
            }
        },

        // API CALLS
        async getApiData(resource: string): Promise<any> {
            try {
                const response = await fetch(this.serverAddress + "/" + resource, {
                    method: "GET",
                    headers: {
                        "ngrok-skip-browser-warning": "any"
                    },
                });
                const resp = await response.json();
                this.apiData = resp;
                console.log(this.apiData);
                return resp;
            } catch (error) {
                return false;
            }
        },

        async login(email: string, password: string, remember: boolean) : Promise<any> {
            try {
                const response = await fetch(this.serverAddress + "/auth", {
                    method: "POST",
                    headers: {
                        "ngrok-skip-browser-warning": "any",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                const data = await response.json();
                console.log(data);

                if (data.success) {
                    if (remember) {
                        localStorage.setItem("token", data.token); // persistent
                    } else {
                        this.token = data.token; // session only
                    }
                    this.isLoggedIn = true;
                    this.updatePages();
                    this.checkIfLoggedIn();
                    return data;
                } else {
                    this.isLoggedIn = false;
                    return data;
                }

            } catch (error) {
                console.log("ERROR: " + JSON.stringify(error));
                return { success: false, message: "Error in the login process." };
            }
        },

        async checkIfLoggedIn(): Promise<void> {
            const token = localStorage.getItem("token") || this.token;
            if (token) {
                const resp = await this.isTokenValid();
                if (resp.loggedIn) {
                    this.isLoggedIn = true;
                    this.userInfo = resp.user;
                    this.token = token;
                } else {
                    this.isLoggedIn = false;
                    this.userInfo = null;
                }
            } else {
                console.log("No token found.");
                this.isLoggedIn = false;
                this.userInfo = null;
            }
            this.updatePages();
        },

        updatePages(): void {
            if (this.isLoggedIn) {
                this.pages = [
                    {
                        link: { text: 'Home', url: '/index' },
                        pageTitle: 'Home Page',
                        content: 'This is the home page.',
                    },
                    {
                        link: { text: 'Map', url: '/map' },
                        pageTitle: 'Map Page',
                        content: 'This is the map page.',
                    },
                    {
                        link: { text: 'Profile', url: '/profile' },
                        pageTitle: 'Profile Page',
                        content: 'This is the profile page.',
                    },
                ];
            } else {
                this.pages = [
                    {
                        link: { text: 'Home', url: '/index' },
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
                    },
                ];
            }
        },
    }
})
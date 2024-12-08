import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        showMap: true,
        rangeError: 0,
        userLatLng: {
            lat: 0,
            lng: 0,
        },

        isLoggedIn: false,

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
            {
                link: { text: 'Profile', url: '/profile' },
                pageTitle: 'Profile Page',
                content: 'This is the profile page.',
            },
        ],
    }),

    
    actions: {
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
                }
                else if (!this.showMap) {
                    console.log("Map is not visible.");
                    reject();
                } else {
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
            if (this.watchId !== null) {
              navigator.geolocation.clearWatch(this.watchId);
              this.watchId = null;
              console.log("Geolocation watch cleared.");
            }
        },

        // API CALLS
        async getApiData(resource: string): Promise<any> {
            try {
                const response = await fetch("https://improved-bright-alien.ngrok-free.app/" + resource, {
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
                const response = await fetch("https://improved-bright-alien.ngrok-free.app/auth", {
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
                        sessionStorage.setItem("token", data.token); // session only
                    }
                    this.isLoggedIn = true;
                    console.log(data);
                    return data;
                } else {
                    this.isLoggedIn = false;
                    return data;
                }

            } catch (error) {
                console.log("ERROR: " + JSON.stringify(error));
                return { success: false, message: "Error in the login process." };
            }
        }
    }
})
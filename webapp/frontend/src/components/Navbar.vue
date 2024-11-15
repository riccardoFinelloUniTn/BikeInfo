<!-- <template>
    <nav :class="['navbar', 'navbar-expand-lg', `navbar-${theme}`, `bg-${theme}`]">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li v-for="(page, index) in pages" class="nav-item" :key="index">
                    <a 
                    class="nav-link"
                    :class="{active: activePage == index}"
                    aria-current="page"
                    :href="page.link.url"
                    :title="`This link goes to the ${page.link.title} page`"
                    @click.prevent="navLinkClick(index)"
                    >{{ page.link.text }}</a>
                </li>
            </ul>
            <form class="d-flex">
                <button 
                    class="btn btn-primary"
                    @click.prevent="changeTheme()"
                >Toggle</button>
            </form>
        </div>
    </nav>
</template> -->

<!-- <script lang="ts">
    import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
    import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
    export default {
        props: ['pages', 'activePage', 'navLinkClick'],
        data(){
            return {
                theme: 'light'
            }
        },
        methods: {
            changeTheme(){
                this.theme = this.theme === 'light' ? 'dark' : 'light';
            }
        }
    }
</script> -->
<!-- 
<script setup lang="ts">
    import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
    import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
</script> -->

<template>
    <!-- <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden"> -->
            <!-- Mobile menu button-->
             <!-- 
            <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex shrink-0 items-center">
              <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <a v-for="(page, index) in pages" :key="index" @click.prevent="navLinkClick(index)" :href="page.link.url" :class="[activePage == index ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="page">{{ page.link.text }}</a>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>
          -->
            <!-- Profile dropdown -->
             <!-- 
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <img class="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton v-for="(page, index) in pages" :key="index" as="a" @click.prevent="navLinkClick(index)" :href="page.link.url" :class="[activePage == index ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="page">{{ page.link.text }}</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure> -->
    <!-- ========== HEADER ========== -->
    <header class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
      <nav class="mt-4 relative max-w-2xl w-full bg-white border border-gray-200 rounded-[2rem] mx-2 py-2.5 md:flex md:items-center md:justify-between md:py-0 md:px-4 md:mx-auto dark:bg-neutral-900 dark:border-neutral-700">
        <div class="px-4 md:px-0 flex justify-between items-center">
          <!-- Logo -->
          <div>
            <a class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="../templates/personal/index.html" aria-label="Preline">
              <svg class="w-24 h-auto" width="116" height="32" viewBox="0 0 116 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.5696 30.8182V11.3182H37.4474V13.7003H37.6229C37.7952 13.3187 38.0445 12.9309 38.3707 12.5369C38.7031 12.1368 39.134 11.8045 39.6634 11.5398C40.1989 11.2689 40.8636 11.1335 41.6577 11.1335C42.6918 11.1335 43.6458 11.4044 44.5199 11.946C45.3939 12.4815 46.0926 13.291 46.6158 14.3743C47.139 15.4515 47.4006 16.8026 47.4006 18.4276C47.4006 20.0095 47.1451 21.3452 46.6342 22.4347C46.1295 23.518 45.4401 24.3397 44.5661 24.8999C43.6982 25.4538 42.7256 25.7308 41.6484 25.7308C40.8852 25.7308 40.2358 25.6046 39.7003 25.3523C39.1709 25.0999 38.737 24.7829 38.3984 24.4013C38.0599 24.0135 37.8014 23.6226 37.6229 23.2287H37.5028V30.8182H33.5696ZM37.4197 18.4091C37.4197 19.2524 37.5367 19.9879 37.7706 20.6158C38.0045 21.2436 38.343 21.733 38.7862 22.0838C39.2294 22.4285 39.768 22.6009 40.402 22.6009C41.0421 22.6009 41.5838 22.4254 42.027 22.0746C42.4702 21.7176 42.8056 21.2251 43.0334 20.5973C43.2673 19.9633 43.3842 19.2339 43.3842 18.4091C43.3842 17.5904 43.2704 16.8703 43.0426 16.2486C42.8149 15.6269 42.4794 15.1406 42.0362 14.7898C41.593 14.4389 41.0483 14.2635 40.402 14.2635C39.7618 14.2635 39.2202 14.4328 38.777 14.7713C38.34 15.1098 38.0045 15.59 37.7706 16.2116C37.5367 16.8333 37.4197 17.5658 37.4197 18.4091ZM49.2427 25.5V11.3182H53.0559V13.7926H53.2037C53.4622 12.9124 53.8961 12.2476 54.5055 11.7983C55.1149 11.3428 55.8166 11.1151 56.6106 11.1151C56.8076 11.1151 57.02 11.1274 57.2477 11.152C57.4754 11.1766 57.6755 11.2105 57.8478 11.2536V14.7436C57.6632 14.6882 57.4077 14.639 57.0815 14.5959C56.7553 14.5528 56.4567 14.5312 56.1859 14.5312C55.6073 14.5312 55.0903 14.6574 54.6348 14.9098C54.1854 15.156 53.8284 15.5007 53.5638 15.9439C53.3052 16.3871 53.176 16.898 53.176 17.4766V25.5H49.2427ZM64.9043 25.777C63.4455 25.777 62.1898 25.4815 61.1373 24.8906C60.0909 24.2936 59.2845 23.4503 58.7182 22.3608C58.1519 21.2652 57.8688 19.9695 57.8688 18.4737C57.8688 17.0149 58.1519 15.7346 58.7182 14.6328C59.2845 13.531 60.0816 12.6723 61.1096 12.0568C62.1437 11.4413 63.3563 11.1335 64.7474 11.1335C65.683 11.1335 66.5539 11.2843 67.3603 11.5859C68.1728 11.8814 68.8806 12.3277 69.4839 12.9247C70.0932 13.5218 70.5672 14.2727 70.9057 15.1776C71.2443 16.0762 71.4135 17.1288 71.4135 18.3352V19.4155H59.4384V16.978H67.7111C67.7111 16.4117 67.588 15.91 67.3418 15.473C67.0956 15.036 66.754 14.6944 66.317 14.4482C65.8861 14.1958 65.3844 14.0696 64.812 14.0696C64.2149 14.0696 63.6856 14.2081 63.2239 14.4851C62.7684 14.7559 62.4114 15.1222 62.1529 15.5838C61.8944 16.0393 61.762 16.5471 61.7559 17.1072V19.4247C61.7559 20.1264 61.8851 20.7327 62.1437 21.2436C62.4083 21.7545 62.7807 22.1484 63.2608 22.4254C63.741 22.7024 64.3103 22.8409 64.9689 22.8409C65.406 22.8409 65.8061 22.7794 66.1692 22.6562C66.5324 22.5331 66.8432 22.3485 67.1018 22.1023C67.3603 21.8561 67.5572 21.5545 67.6927 21.1974L71.3304 21.4375C71.1458 22.3116 70.7672 23.0748 70.1948 23.7273C69.6285 24.3736 68.896 24.8783 67.9974 25.2415C67.1048 25.5985 66.0738 25.777 64.9043 25.777ZM77.1335 6.59091V25.5H73.2003V6.59091H77.1335ZM79.5043 25.5V11.3182H83.4375V25.5H79.5043ZM81.4801 9.49006C80.8954 9.49006 80.3937 9.29616 79.9752 8.90838C79.5628 8.51444 79.3566 8.04356 79.3566 7.49574C79.3566 6.95407 79.5628 6.48935 79.9752 6.10156C80.3937 5.70762 80.8954 5.51065 81.4801 5.51065C82.0649 5.51065 82.5635 5.70762 82.9759 6.10156C83.3944 6.48935 83.6037 6.95407 83.6037 7.49574C83.6037 8.04356 83.3944 8.51444 82.9759 8.90838C82.5635 9.29616 82.0649 9.49006 81.4801 9.49006ZM89.7415 17.3011V25.5H85.8083V11.3182H89.5569V13.8203H89.723C90.037 12.9955 90.5632 12.343 91.3019 11.8629C92.0405 11.3767 92.9361 11.1335 93.9887 11.1335C94.9735 11.1335 95.8322 11.349 96.5647 11.7798C97.2971 12.2107 97.8665 12.8262 98.2728 13.6264C98.679 14.4205 98.8821 15.3684 98.8821 16.4702V25.5H94.9489V17.1719C94.9551 16.304 94.7335 15.6269 94.2841 15.1406C93.8348 14.6482 93.2162 14.402 92.4283 14.402C91.8989 14.402 91.4311 14.5159 91.0249 14.7436C90.6248 14.9714 90.3109 15.3037 90.0831 15.7408C89.8615 16.1716 89.7477 16.6918 89.7415 17.3011ZM107.665 25.777C106.206 25.777 104.951 25.4815 103.898 24.8906C102.852 24.2936 102.045 23.4503 101.479 22.3608C100.913 21.2652 100.63 19.9695 100.63 18.4737C100.63 17.0149 100.913 15.7346 101.479 14.6328C102.045 13.531 102.842 12.6723 103.87 12.0568C104.905 11.4413 106.117 11.1335 107.508 11.1335C108.444 11.1335 109.315 11.2843 110.121 11.5859C110.934 11.8814 111.641 12.3277 112.245 12.9247C112.854 13.5218 113.328 14.2727 113.667 15.1776C114.005 16.0762 114.174 17.1288 114.174 18.3352V19.4155H102.199V16.978H110.472C110.472 16.4117 110.349 15.91 110.103 15.473C109.856 15.036 109.515 14.6944 109.078 14.4482C108.647 14.1958 108.145 14.0696 107.573 14.0696C106.976 14.0696 106.446 14.2081 105.985 14.4851C105.529 14.7559 105.172 15.1222 104.914 15.5838C104.655 16.0393 104.523 16.5471 104.517 17.1072V19.4247C104.517 20.1264 104.646 20.7327 104.905 21.2436C105.169 21.7545 105.542 22.1484 106.022 22.4254C106.502 22.7024 107.071 22.8409 107.73 22.8409C108.167 22.8409 108.567 22.7794 108.93 22.6562C109.293 22.5331 109.604 22.3485 109.863 22.1023C110.121 21.8561 110.318 21.5545 110.454 21.1974L114.091 21.4375C113.907 22.3116 113.528 23.0748 112.956 23.7273C112.389 24.3736 111.657 24.8783 110.758 25.2415C109.866 25.5985 108.835 25.777 107.665 25.777Z" class="fill-gray-800 dark:fill-white" fill="currentColor"/>
                <path d="M1 29.5V16.5C1 9.87258 6.37258 4.5 13 4.5C19.6274 4.5 25 9.87258 25 16.5C25 23.1274 19.6274 28.5 13 28.5H12" class="stroke-gray-800 dark:stroke-white" stroke="currentColor" stroke-width="2"/>
                <path d="M5 29.5V16.66C5 12.1534 8.58172 8.5 13 8.5C17.4183 8.5 21 12.1534 21 16.66C21 21.1666 17.4183 24.82 13 24.82H12" class="stroke-gray-800 dark:stroke-white" stroke="currentColor" stroke-width="2"/>
                <circle cx="13" cy="16.5214" r="5" class="fill-gray-800 dark:fill-white" fill="currentColor"/>
              </svg>
              <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="768" width="1024">
                  <g>
                      <g style="font-style:normal;font-weight:700;font-size:72px;line-height:1;font-family:'Comfortaa Bold Alt2';font-variant-ligatures:none;text-align:center;text-anchor:middle">
                          <path style="font-style:normal;font-weight:700;font-size:72px;line-height:1;font-family:'Comfortaa Bold Alt2';font-variant-ligatures:none;text-align:center;text-anchor:middle" d="M359.475-55.152c-.72.72-1.08 1.584-1.08 2.664v48.744c0 1.08.36 1.944 1.08 2.664.72.72 1.584 1.08 2.664 1.08s1.944-.36 2.664-1.08c.72-.72 1.08-1.584 1.08-2.664v-48.744c0-1.08-.36-1.944-1.08-2.664-.72-.72-1.584-1.08-2.664-1.08s-1.944.36-2.664 1.08zM412.805.216c1.008 0 1.872-.36 2.592-1.08.72-.72 1.008-1.584 1.008-2.592V-21.96c0-5.04-1.8-9.36-5.328-12.96-3.6-3.6-7.992-5.4-13.032-5.4-5.112 0-9.432 1.8-13.032 5.4-3.6 3.6-5.4 7.92-5.4 12.96v18.504c0 1.008.36 1.872 1.08 2.592.72.72 1.584 1.008 2.52 1.008 1.008 0 1.872-.288 2.592-1.008s1.008-1.584 1.008-2.592V-21.96c0-3.024 1.152-5.688 3.312-7.848 2.16-2.232 4.824-3.312 7.92-3.312s5.688 1.08 7.92 3.312c2.16 2.16 3.24 4.824 3.24 7.848v18.576c0 .936.36 1.8 1.08 2.52.72.72 1.584 1.08 2.52 1.08zM444.243-49.32c1.008 0 1.8-.288 2.52-1.008s1.08-1.584 1.08-2.592-.36-1.8-1.08-2.52c-.72-.72-1.512-1.08-2.52-1.08-4.104 0-7.56 1.44-10.44 4.32-2.88 2.88-4.32 6.408-4.32 10.44v38.304c0 1.008.288 1.872 1.008 2.592s1.584 1.008 2.592 1.008 1.8-.288 2.52-1.008 1.08-1.584 1.08-2.592v-28.152h7.2c.864 0 1.656-.288 2.304-.936a3.203 3.203 0 0 0 .936-2.304c0-.864-.36-1.656-.936-2.304-.648-.576-1.44-.936-2.304-.936h-7.2v-3.672c0-2.016.72-3.816 2.232-5.328 1.44-1.44 3.24-2.232 5.328-2.232z" transform="matrix(1.11 0 0 1.11 -61.543 415.089)"/>
                          <path style="font-style:normal;font-weight:700;font-size:72px;line-height:1;font-family:'Comfortaa Bold Alt2';font-variant-ligatures:none;text-align:center;text-anchor:middle" d="M553.712-54.288c-2.52-1.296-5.4-1.944-8.568-1.944h-17.208c-1.08 0-1.944.36-2.664 1.08-.72.72-1.08 1.584-1.08 2.664v48.744c0 1.08.36 1.944 1.08 2.664.72.72 1.584 1.08 2.664 1.08h18.72c3.528 0 6.696-.72 9.504-2.16 2.808-1.44 4.968-3.456 6.552-6.048 1.584-2.592 2.376-5.472 2.376-8.784 0-3.528-.936-6.48-2.808-8.784-1.872-2.304-4.464-3.816-7.704-4.608 2.16-1.152 3.888-2.664 5.184-4.536 1.296-1.872 1.944-3.96 1.944-6.336 0-2.88-.72-5.4-2.16-7.704-1.44-2.304-3.384-4.032-5.832-5.328zm-1.8 19.08c-1.728 1.44-3.96 2.088-6.768 2.088H531.68v-16.2h13.464c2.808 0 5.04.72 6.768 2.088 1.728 1.368 2.592 3.384 2.592 5.976 0 2.664-.864 4.68-2.592 6.048zm2.88 25.704c-2.088 1.728-4.824 2.592-8.136 2.592H531.68v-19.296h14.976c3.384 0 6.12.792 8.136 2.376 2.016 1.584 3.096 3.888 3.096 6.84 0 3.24-1.08 5.76-3.096 7.488zM577.231-38.376c-.72.72-1.008 1.584-1.008 2.664v32.04c0 1.08.288 1.944 1.008 2.664.72.72 1.584 1.008 2.664 1.008s1.944-.288 2.664-1.008c.648-.72 1.008-1.584 1.008-2.664v-32.04c0-1.08-.36-1.944-1.008-2.664-.72-.648-1.584-1.008-2.664-1.008s-1.944.36-2.664 1.008zm5.976-15.48c-.936-.936-2.016-1.44-3.312-1.44-1.296 0-2.448.504-3.384 1.44-.936.936-1.368 2.016-1.368 3.312 0 1.296.432 2.448 1.368 3.384.936.936 2.088 1.368 3.384 1.368 1.296 0 2.376-.432 3.312-1.368.936-.936 1.44-2.088 1.44-3.384 0-1.296-.504-2.376-1.44-3.312zM627.828-3.024c0-.864-.288-1.584-.792-2.16L613.068-22.32l13.248-11.808c.72-.576 1.152-1.44 1.152-2.448 0-.864-.36-1.584-.936-2.232-.648-.72-1.44-1.152-2.448-1.152-.864 0-1.656.36-2.232.936L604.356-23.4v-29.304c0-1.008-.36-1.872-1.008-2.52-.648-.648-1.512-1.008-2.52-1.008-1.08 0-1.944.36-2.592 1.008-.648.648-.936 1.512-.936 2.52v49.176c0 1.08.288 1.944.936 2.592.648.648 1.512.936 2.592.936 1.008 0 1.872-.288 2.52-.936.648-.648 1.008-1.512 1.008-2.592v-11.016l3.6-3.168 13.68 16.92c.648.864 1.512 1.296 2.592 1.296.792 0 1.584-.288 2.304-.864.864-.72 1.296-1.584 1.296-2.664zM651.486.288c4.752 0 8.928-1.44 12.6-4.464.792-.576 1.152-1.368 1.296-2.304.072-1.008-.144-1.8-.792-2.592a3.2 3.2 0 0 0-2.304-1.224c-.936-.072-1.8.144-2.52.792-2.448 1.944-5.184 2.88-8.28 2.88-3.6 0-6.696-1.224-9.216-3.816-2.592-2.52-3.816-5.616-3.816-9.216 0-3.6 1.224-6.696 3.816-9.288 2.52-2.52 5.616-3.816 9.216-3.816 2.952 0 5.616.936 7.992 2.736 2.304 1.8 3.816 4.104 4.608 6.912h-12.6c-.936 0-1.8.36-2.448 1.008a3.429 3.429 0 0 0-1.008 2.448c0 .936.36 1.8 1.008 2.448a3.429 3.429 0 0 0 2.448 1.008h16.56c.936 0 1.728-.36 2.376-1.008a3.224 3.224 0 0 0 1.08-2.448c0-5.544-2.016-10.224-5.904-14.112s-8.568-5.904-14.112-5.904c-5.544 0-10.224 2.016-14.112 5.904s-5.832 8.568-5.832 14.112c0 5.544 1.944 10.224 5.832 14.112S645.942.288 651.486.288z" transform="matrix(1.11 0 0 1.11 -57.643 415.089)"/>
                      </g>
                      <image xlink:href="data:image/png;base64,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" x="451" y="-42" width="43.912" height="43.912" transform="matrix(1.11 0 0 1.11 -61.543 415.089)"/>
                  </g>
              </svg> -->

            </a>
          </div>
          <!-- End Logo -->

          <div class="md:hidden">
            <!-- Toggle Button -->
            <button type="button" class="hs-collapse-toggle flex justify-center items-center size-6 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" id="hs-navbar-header-floating-collapse" aria-expanded="false" aria-controls="hs-navbar-header-floating" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-header-floating">
              <svg class="hs-collapse-open:hidden shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              <svg class="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <!-- End Toggle Button -->
          </div>
        </div>

        <div id="hs-navbar-header-floating" class="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-navbar-header-floating-collapse">
          <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-3 mt-3 md:mt-0 py-2 md:py-0 md:ps-7">
            <a 
              v-for="(page, index) in pages" 
              :key="index"
              @click.prevent="navLinkClick(index)"
              :href="page.link.url"
              aria-current="page"
              class="py-0.5 md:py-3 px-4 md:px-1 border-s-2 md:border-s-0 md:border-b-2 border-transparent text-gray-500 hover:text-gray-800 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-200"
            > {{ page.link.text }} </a>
          </div>
        </div>
      </nav>
    </header>
    <!-- ========== END HEADER ========== -->
  </template>
  
  <script lang="ts">
    export default {
        props: ['pages', 'activePage', 'navLinkClick'],
        data(){
            return {
                theme: 'light'
            }
        },
        methods: {
            changeTheme(){
                this.theme = this.theme === 'light' ? 'dark' : 'light';
            }
        }
    }
  </script>
<template>
	<SettingItem :icon="LogoChrome" name="Chrome" description="Chrome Web Store" to="https://chrome.google.com/webstore/detail/arweaveapp/hloekinecmafifaghekdjepphlabepkl" />
	<SettingItem :icon="LogoEdge" name="Edge" description="Chrome Web Store" to="https://chrome.google.com/webstore/detail/arweaveapp/hloekinecmafifaghekdjepphlabepkl" />
	<SettingItem :icon="LogoFirefox" name="Firefox" description="Addons for Firefox" to="https://addons.mozilla.org/firefox/addon/arweave-app" />
</template>



<script setup lang="ts">
import SettingItem from '@/components/composed/SettingItem.vue'

import LogoChrome from '@/assets/logos/browsers/chrome.svg?component'
import LogoFirefox from '@/assets/logos/browsers/firefox.svg?component'
import LogoEdge from '@/assets/logos/browsers/edge.svg?component'
</script>

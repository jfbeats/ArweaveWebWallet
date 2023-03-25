<template>
	<SettingItem :icon="LOGO.browsers.chrome" name="Chrome" description="Chrome Web Store" to="https://chrome.google.com/webstore/detail/arweaveapp/hloekinecmafifaghekdjepphlabepkl" />
	<SettingItem :icon="LOGO.browsers.edge" name="Edge" description="Chrome Web Store" to="https://chrome.google.com/webstore/detail/arweaveapp/hloekinecmafifaghekdjepphlabepkl" />
	<SettingItem :icon="LOGO.browsers.firefox" name="Firefox" description="Addons for Firefox" to="https://addons.mozilla.org/firefox/addon/arweave-app" />
</template>



<script setup lang="ts">
import SettingItem from '@/components/composed/SettingItem.vue'
import { LOGO } from '@/store/Theme'
</script>

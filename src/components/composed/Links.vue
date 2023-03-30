<template>
	<SettingItem :icon="LOGO.arweave" name="Guide" description="How to get started using the wallet" to="https://docs.arweave.org/info/wallets/arweave-wallet"/>
	<SettingItem v-if="Wallets.length" :icon="LOGO.socials.discord" name="Discord" description="Send feedback, questions or talk about anything" to="https://discord.gg/W6VybRqwBP"/>
	<SettingItem :icon="LOGO.socials.twitter" name="Twitter" description="Announcements" to="https://twitter.com/ArweaveApp"/>
	<SettingItem :icon="LOGO.socials.github" name="Github | Web Wallet" description="Source code" to="https://github.com/jfbeats/ArweaveWebWallet"/>
	<SettingItem :icon="LOGO.socials.github" name="Github | Wallet Connector" description="Integrate the universal connector to use web wallets like arweave.app inside your own applications" to="https://jfbeats.github.io/ArweaveWalletConnector"/>
	<SettingItem :icon="ICON.text" name="Arwiki" description="Wiki on the Arweave protocol" to="https://arwiki.wiki"/>
</template>



<script setup lang="ts">
import SettingItem from '@/components/composed/SettingItem.vue'
import { Wallets } from '@/functions/Wallets'
import { LOGO } from '@/store/Theme'
import { ICON } from '@/store/Theme'
</script>

<template>
	<SettingItem :icon="LogoArweave" name="Guide" description="How to get started using the wallet" to="https://docs.arweave.org/info/wallets/arweave-wallet"/>
	<SettingItem v-if="Wallets.length" :icon="LogoDiscord" name="Discord" description="Send feedback, questions or talk about anything" to="https://discord.gg/W6VybRqwBP"/>
	<SettingItem :icon="LogoTwitter" name="Twitter" description="Announcements" to="https://twitter.com/ArweaveApp"/>
	<SettingItem :icon="LogoGithub" name="Github | Web Wallet" description="Source code" to="https://github.com/jfbeats/ArweaveWebWallet"/>
	<SettingItem :icon="LogoGithub" name="Github | Wallet Connector" description="Integrate the universal connector to use web wallets like arweave.app inside your own applications" to="https://jfbeats.github.io/ArweaveWalletConnector"/>
	<SettingItem :icon="IconText" name="Arwiki" description="Wiki on the Arweave protocol" to="https://arwiki.wiki"/>
</template>



<script setup lang="ts">
import SettingItem from '@/components/composed/SettingItem.vue'
import { Wallets } from '@/functions/Wallets'

import LogoGithub from '@/assets/logos/socials/github.svg?component'
import LogoDiscord from '@/assets/logos/socials/discord.svg?component'
import LogoTwitter from '@/assets/logos/socials/twitter.svg?component'
import LogoArweave from '@/assets/logos/arweave.svg?component'
import IconText from '@/assets/icons/text.svg?component'
</script>

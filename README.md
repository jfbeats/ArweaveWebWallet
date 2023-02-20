# Arweave Web Wallet

![Header image](public/arweaveViewLandscape.svg)

## Link

https://arweave.app

## Features

- Local-first, self-custodial wallet
- Create / Import / Export wallets by passphrase or key file
- Ledger support (awaiting release on Ledger app store)
- Send and receive AR tokens
- Upload permanent data (text, files, folders, deploy static websites)
- View transactions and data
- [Connector](https://github.com/jfbeats/ArweaveWalletConnector) - Login to any account securely across all decentralized applications
- [Permafrost Vault](https://arweave.app/cold) - Turn any device into a cold hardware wallet

## Open standards

### Identity

Profile data is hosted permanently on the weave. To represent user profile for a specific address, the latest transaction using the tag `App-Name: arweave-id` is selected and the following tag values are displayed:

User info
- `Name: string` Username
- `Text: string` Bio

Profile picture
- `Image: TxId` ID pointing to the data (if a transaction containing the image data was posted independently)
- `Content-Type: image/png | image/svg | ...` MIME type tag (included with the transaction containing the image data)

### Communication between domains

The [Connector](https://github.com/jfbeats/ArweaveWalletConnector), which arweave.app implements as a provider, offers a secure way to share a single login across all decentralized applications. The API accepts JSON RPC messages sent by external applications. To use website wallets like arweave.app in your own project, or for more details, see the [Connector](https://github.com/jfbeats/ArweaveWalletConnector) page.

### Communication between devices

The [Permafrost Vault](https://arweave.app/cold) offers a way to run the application in an air-gaped context and pass signed/unsigned transaction parameters through user selected means (QR codes, Files, Bluetooth, USB, ...) between an online relay and offline vault. Each message must be transferred in a single clear text item to allow for easy verifiability.

To shorten message length when necessary, the public key (owner field) can be omitted by the vault in the returned signed transaction if it was already included in the received unsigned transaction (safe to assume that the value is already known by the online relay).

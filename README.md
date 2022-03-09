# Arweave Web Wallet

![Header image](public/arweaveViewLandscape.svg)

## Link

https://arweave.app

## Features

- Local-first, self-custodial wallet
- Create / Import / Export wallets by passphrase or key file
- Ledger support (awaiting release on Ledger app store)
- Send and receive AR tokens
- Upload permanent data
- View transactions and data
- Connect and use your accounts with any web applications supporting the [connector](https://github.com/jfbeats/ArweaveWalletConnector)

## Open standards

### Identity

Profile data is hosted permanently on the weave. To represent user profile for a specific address, the latest transaction using the tag `App-Name: arweave-id` is selected and the following tag values are displayed:

User info
- `Name: string` Username
- `Text: string` Bio

Profile picture
- `Image: TxId` ID pointing to the data (if a transaction containing the image data was posted independently)
- `Content-Type: image/png | image/svg | ...` MIME type tag (included with the transaction containing the image data)

### Communication

Arweave.app can be used as a secure solution for account and permission management while browsing other websites. The API accepts JSON RPC messages sent by external applications. To use website wallets like arweave.app in your own application, or for more details, see the [connector](https://github.com/jfbeats/ArweaveWalletConnector) page
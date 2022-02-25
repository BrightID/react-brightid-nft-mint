# React BrightID 10K NFT Mint

## Install

    npm install react-brightid-nft-mint

## Use With Relay Server

Using the module with a relay server is a much better user experience, but requires you setting up a server, and funding a wallet with EIDI. This server will handle the IDChain transactions on behalf of the user. The relay server code can be found at https://github.com/BrightID/brightid-nft-mint-relay.

### Import

```
import { BrightIDNftMint } from "react-brightid-nft-mint";
```

### Include in Template

```
<BrightIDNftMint
    context="__YOUR_BRIGHT_ID_CONTEXT__"
    contractAddr="__YOUR_REGISTRATION_CONTRACT_ADDRESS__"
    mainnetRpcUrl="https://mainnet.infura.io/v3/__YOUR_INFURA_ID__"
    walletConnectInfuraId="__YOUR_INFURA_ID__"
    relayBindURL="__URL_OF_RELAY_BIND_ENDPOINT__"
    relayMintURL="__URL_OF_RELAY_MINT_ENDPOINT__"
/>
```

### Other Overridable Options

```
appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid"
appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820"
brightIdMeetUrl = "https://meet.brightid.org"
deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org"
mintChainId = "100"
mintChainName = "Gnosis Chain"
mintBlockExplorerUrl = "https://blockscout.com/xdai/mainnet"
mintBlockExplorerTxnPath = "/tx/"
mintRpcUrl = "https://rpc.gnosischain.com/"
verificationUrl = "https://app.brightid.org/node/v5/verifications"
```

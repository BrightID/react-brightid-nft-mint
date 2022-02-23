# React BrightID Registration

## Install

    npm install react-brightid-registration

## Use With Relay Server

Using the module with a relay server is a much better user experience, but requires you setting up a server, and funding a wallet with EIDI. This server will handle the IDChain transactions on behalf of the user. The relay server code can be found at https://github.com/SongADAO/brightid-10k-nft-mint-relay.

### Import

```
import { BrightID10KNftMint } from "react-brightid-registration";
```

### Include in Template

```
<BrightID10KNftMint
    context="__YOUR_BRIGHT_ID_CONTEXT__"
    contractAddr="__YOUR_REGISTRATION_CONTRACT_ADDRESS__"
    mainnetRpcUrl="https://mainnet.infura.io/v3/__YOUR_INFURA_ID__"
    walletConnectInfuraId="__YOUR_INFURA_ID__"
    relayVerificationURL="__URL_OF_RELAY_REGISTRATION_ENDPOINT__"
/>
```

### Other Overridable Options

```
appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid"
appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820"
brightIdMeetUrl = "https://meet.brightid.org"
deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org"
registrationChainId = "74"
registrationRpcUrl = "https://idchain.one/rpc/"
verificationUrl = "https://app.brightid.org/node/v5/verifications"
```

## Use Without Relay Server

### Import

```
import { BrightID10KNftMint } from "react-brightid-registration";
```

### Include in Template

```
<BrightID10KNftMint
    context="__YOUR_BRIGHT_ID_CONTEXT__"
    contractAddr="__YOUR_REGISTRATION_CONTRACT_ADDRESS__"
    mainnetRpcUrl="https://mainnet.infura.io/v3/__YOUR_INFURA_ID__"
    walletConnectInfuraId="__YOUR_INFURA_ID__"
/>
```

### Other Overridable Options

```
appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid",
appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820",
brightIdMeetUrl = "https://meet.brightid.org",
deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org",
faucetClaimURL = "https://idchain.one/begin/api/claim",
registrationBlockExplorerTxnPath = "/tx/",
registrationBlockExplorerUrl = "https://explorer.idchain.one",
registrationChainId = "74",
registrationChainName = "IDChain",
registrationIconUrl = "https://apps.brightid.org/logos/idchain.png",
registrationRpcUrl = "https://idchain.one/rpc/",
registrationTokenDecimal = "18",
registrationTokenName = "Eidi",
verificationUrl = "https://app.brightid.org/node/v5/verifications",
```

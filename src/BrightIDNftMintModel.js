import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

class BrightIDNftMintModel {
    contractAbi = [
        {
            type: "constructor",
            stateMutability: "nonpayable",
            inputs: [
                { type: "address", name: "verifier", internalType: "address" },
                { type: "bytes32", name: "context", internalType: "bytes32" },
                { type: "string", name: "name_", internalType: "string" },
                { type: "string", name: "symbol_", internalType: "string" },
            ],
        },
        {
            type: "event",
            name: "ContextSet",
            inputs: [
                {
                    type: "bytes32",
                    name: "context",
                    internalType: "bytes32",
                    indexed: false,
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
                {
                    type: "address",
                    name: "previousOwner",
                    internalType: "address",
                    indexed: true,
                },
                {
                    type: "address",
                    name: "newOwner",
                    internalType: "address",
                    indexed: true,
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Transfer",
            inputs: [
                {
                    type: "address",
                    name: "from",
                    internalType: "address",
                    indexed: true,
                },
                {
                    type: "address",
                    name: "to",
                    internalType: "address",
                    indexed: true,
                },
                {
                    type: "uint256",
                    name: "tokenId",
                    internalType: "uint256",
                    indexed: true,
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "VerifierSet",
            inputs: [
                {
                    type: "address",
                    name: "verifier",
                    internalType: "address",
                    indexed: false,
                },
            ],
            anonymous: false,
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
            name: "balanceOf",
            inputs: [
                { type: "address", name: "owner", internalType: "address" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "bind",
            inputs: [
                { type: "address", name: "owner", internalType: "address" },
                { type: "bytes32", name: "uuidHash", internalType: "bytes32" },
                { type: "uint256", name: "nonce", internalType: "uint256" },
                { type: "bytes", name: "signature", internalType: "bytes" },
            ],
        },
        {
            type: "function",
            stateMutability: "pure",
            outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
            name: "getUUIDHash",
            inputs: [
                { type: "address", name: "owner", internalType: "address" },
                { type: "bytes32", name: "uuidHash", internalType: "bytes32" },
                { type: "uint256", name: "nonce", internalType: "uint256" },
            ],
        },
        {
            type: "function",
            stateMutability: "pure",
            outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
            name: "hashUUID",
            inputs: [
                { type: "bytes32", name: "uuid", internalType: "bytes32" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "mint",
            inputs: [
                {
                    type: "bytes32[]",
                    name: "contextIds",
                    internalType: "bytes32[]",
                },
                { type: "uint256", name: "timestamp", internalType: "uint256" },
                { type: "uint8", name: "v", internalType: "uint8" },
                { type: "bytes32", name: "r", internalType: "bytes32" },
                { type: "bytes32", name: "s", internalType: "bytes32" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "string", name: "", internalType: "string" }],
            name: "name",
            inputs: [],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "address", name: "", internalType: "address" }],
            name: "owner",
            inputs: [],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "address", name: "", internalType: "address" }],
            name: "ownerOf",
            inputs: [
                { type: "uint256", name: "tokenId", internalType: "uint256" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "renounceOwnership",
            inputs: [],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "rescue",
            inputs: [
                {
                    type: "bytes32[]",
                    name: "contextIds",
                    internalType: "bytes32[]",
                },
                { type: "uint256", name: "timestamp", internalType: "uint256" },
                { type: "uint256", name: "tokenId", internalType: "uint256" },
                { type: "uint8", name: "v", internalType: "uint8" },
                { type: "bytes32", name: "r", internalType: "bytes32" },
                { type: "bytes32", name: "s", internalType: "bytes32" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "rescue",
            inputs: [
                {
                    type: "bytes32[]",
                    name: "contextIds",
                    internalType: "bytes32[]",
                },
                { type: "uint256", name: "timestamp", internalType: "uint256" },
                { type: "uint256", name: "tokenId", internalType: "uint256" },
                { type: "uint8", name: "v", internalType: "uint8" },
                { type: "bytes32", name: "r", internalType: "bytes32" },
                { type: "bytes32", name: "s", internalType: "bytes32" },
                { type: "bytes", name: "data", internalType: "bytes" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "setContext",
            inputs: [
                { type: "bytes32", name: "context", internalType: "bytes32" },
            ],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "setVerifier",
            inputs: [
                { type: "address", name: "verifier", internalType: "address" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "bool", name: "", internalType: "bool" }],
            name: "supportsInterface",
            inputs: [
                { type: "bytes4", name: "interfaceId", internalType: "bytes4" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "string", name: "", internalType: "string" }],
            name: "symbol",
            inputs: [],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
            name: "tokenByIndex",
            inputs: [
                { type: "uint256", name: "index", internalType: "uint256" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
            name: "tokenOfOwnerByIndex",
            inputs: [
                { type: "address", name: "owner", internalType: "address" },
                { type: "uint256", name: "index", internalType: "uint256" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "string", name: "", internalType: "string" }],
            name: "tokenURI",
            inputs: [
                { type: "uint256", name: "tokenId", internalType: "uint256" },
            ],
        },
        {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
            name: "totalSupply",
            inputs: [],
        },
        {
            type: "function",
            stateMutability: "nonpayable",
            outputs: [],
            name: "transferOwnership",
            inputs: [
                { type: "address", name: "newOwner", internalType: "address" },
            ],
        },
    ];

    web3Modal;

    web3Instance;

    walletAddress = "";

    ensName = "";

    chainId = 0;

    brightIDLinkedWallets = [];

    isBrightIDLinked = false;

    isUUIDLinked = false;

    isBoundViaContract = false;

    isMintedViaContract = false;

    context = "";

    contractAddr = "";

    mainnetRpcUrl = "";

    walletConnectInfuraId = "";

    relayBindURL = "";

    relayMintURL = "";

    appStoreAndroid = "";

    appStoreIos = "";

    brightIdMeetUrl = "";

    deepLinkPrefix = "";

    mintChainId = 0;

    mintChainName = "";

    verificationUrl = "";

    uuid = "";

    uuidHex = "";

    uuidByte32 = "";

    constructor(
        context = "",
        contractAddr = "",
        mainnetRpcUrl = "",
        walletConnectInfuraId = "",
        relayBindURL = "",
        relayMintURL = "",
        appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid",
        appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820",
        brightIdMeetUrl = "https://meet.brightid.org",
        deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org",
        mintChainId = 100,
        mintChainName = "Gnosis Chain",
        mintRpcUrl = "https://rpc.gnosischain.com/",
        verificationUrl = "https://app.brightid.org/node/v5/verifications"
    ) {
        this.context = context;
        this.contractAddr = contractAddr;
        this.mainnetRpcUrl = mainnetRpcUrl;
        this.walletConnectInfuraId = walletConnectInfuraId;
        this.relayBindURL = relayBindURL;
        this.relayMintURL = relayMintURL;

        this.appStoreAndroid = appStoreAndroid;
        this.appStoreIos = appStoreIos;
        this.brightIdMeetUrl = brightIdMeetUrl;
        this.deepLinkPrefix = deepLinkPrefix;
        this.mintChainId = Number(mintChainId);
        this.mintChainName = mintChainName;
        this.mintRpcUrl = mintRpcUrl;
        this.verificationUrl = verificationUrl;

        console.log("UUID");
        this.uuid = crypto.randomUUID();
        // this.uuid = ethers.utils.randomBytes(16);
        console.log(this.uuid);

        console.log("UUID Hex");
        this.uuidHex = this.uuid.replaceAll("-", "");
        // this.uuidHex = new Buffer(this.uuid).toString("hex");
        console.log(this.uuidHex);

        this.uuidHex = "a5e502211e8b406b8877e68a01063cfe"; // DEBUG

        console.log("UUID Bytes32");
        this.uuidByte32 = "0x" + new Buffer(this.uuidHex).toString("hex");
        console.log(this.uuidByte32);
    }

    resetWalletData() {
        this.walletAddress = "";
        this.ensName = "";
        this.isBrightIDLinked = false;
        this.isUUIDLinked = false;
        this.isBoundViaContract = false;
        this.isMintedViaContract = false;
    }

    /* Web3 Modal & Instances */
    /* ---------------------------------------------------------------------- */

    async initWeb3Modal() {
        if (typeof this.web3Modal === "object") {
            return;
        }

        console.log("initWeb3Modal");

        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: this.walletConnectInfuraId, // required
                },
            },
        };

        this.web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions, // required
        });
    }

    async initInstance() {
        if (typeof this.web3Instance === "object") {
            return;
        }

        console.log("initInstance");

        await this.initWeb3Modal();

        const web3Instance = await this.web3Modal.connect();

        this.web3Instance = web3Instance;
    }

    async initFreshInstance() {
        console.log("initFreshInstance");

        await this.initWeb3Modal();

        await this.web3Modal.clearCachedProvider();
        localStorage.removeItem("walletconnect");
        localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
        localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");

        const web3Instance = await this.web3Modal.connect();

        this.web3Instance = web3Instance;
    }

    /* Providers */
    /* ---------------------------------------------------------------------- */

    async getProvider() {
        await this.initInstance();

        return new ethers.providers.Web3Provider(this.web3Instance);
    }

    getMainnetProvider() {
        return new ethers.providers.JsonRpcProvider(this.mainnetRpcUrl);
    }

    getRegistrationProvider() {
        return new ethers.providers.JsonRpcProvider(this.mintRpcUrl);
    }

    /* Contracts */
    /* ---------------------------------------------------------------------- */

    async getRegistrationProviderContract() {
        const provider = await this.getRegistrationProvider();

        return new ethers.Contract(
            this.contractAddr,
            this.contractAbi,
            provider
        );
    }

    async getRegistrationProviderContractRw() {
        const provider = await this.getRegistrationProvider();

        return new ethers.Contract(
            this.contractAddr,
            this.contractAbi,
            provider.getSigner()
        );
    }

    async getContract() {
        const provider = await this.getProvider();

        return new ethers.Contract(
            this.contractAddr,
            this.contractAbi,
            provider
        );
    }

    async getContractRw() {
        const provider = await this.getProvider();

        return new ethers.Contract(
            this.contractAddr,
            this.contractAbi,
            provider.getSigner()
        );
    }

    /* Provider Feature Detection */
    /* ---------------------------------------------------------------------- */

    getProviderType() {
        return JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
    }

    canAutoSwitchNetworks() {
        return this.getProviderType() !== "walletconnect";
    }

    hasReconnectableWallet() {
        return (
            this.getProviderType() === "injected" ||
            this.getProviderType() === "walletconnect"
        );
    }

    /* Data Query */
    /* ---------------------------------------------------------------------- */

    async getWalletAddress() {
        if (
            typeof this.walletAddress === "string" &&
            this.walletAddress !== ""
        ) {
            return this.walletAddress;
        }

        console.log("getWalletAddress");

        this.walletAddress = await this.queryWalletAddress();

        return this.walletAddress;
    }

    async getQrCodeUrl() {
        const addr = await this.getWalletAddress();

        return `${this.deepLinkPrefix}/${this.context}/${addr}`;
    }

    async getQrCodeUUIDUrl() {
        return `${this.deepLinkPrefix}/${this.context}/${this.uuidByte32}`;
    }

    async queryWalletAddress() {
        try {
            console.log("queryWalletAddress");

            const provider = await this.getProvider();

            const accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                throw new Error("No WalAddress Found");
            }

            return accounts[0];
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return "";
        }
    }

    async queryENSName() {
        try {
            console.log("queryENSName");

            const addr = await this.getWalletAddress();

            const provider = this.getMainnetProvider();

            const name = await provider.lookupAddress(addr);

            // console.log(name);

            return name;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return "";
        }
    }

    async queryChainId() {
        try {
            console.log("queryChainId");

            const provider = await this.getProvider();

            const { chainId } = await provider.getNetwork();

            return chainId;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return 0;
        }
    }

    async queryBrightIDLink(contextId) {
        try {
            console.log("queryBrightIDLink");

            const userVerificationUrl = `${this.verificationUrl}/${this.context}/${contextId}?signed=null&timestamp=null`;

            // console.log(userVerificationUrl);

            const request = new Request(userVerificationUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            });

            const response = await fetch(request);

            // console.log(response);

            if (response.ok === true) {
                const responseJson = await response.json();

                // console.log(responseJson);

                return (
                    responseJson.data.contextIds[0].toLowerCase() ===
                    contextId.toLowerCase()
                );

                // return true; // DEBUG
            }

            if (response.status === 403) {
                return true;
            }

            return false;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return false;
        }
    }

    async queryBrightIDSponsorship(contextId) {
        try {
            console.log("queryBrightIDSponsorship");

            const userVerificationUrl = `${this.verificationUrl}/${this.context}/${contextId}?signed=eth&timestamp=seconds`;

            // console.log(userVerificationUrl);

            const request = new Request(userVerificationUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            });

            const response = await fetch(request);

            // console.log(response);

            return response.ok;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return false;
        }
    }

    async queryTokenBalance() {
        try {
            console.log("queryTokenBalance");

            const addr = await this.getWalletAddress();
            // const addr = "0xb9d52bbfa575fdf0b0dfee9fc09c5010feab98c9";

            const contract = await this.getRegistrationProviderContract();

            const balance = await contract.balanceOf(addr);

            // console.log(balance);

            return balance > 0;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return false;
        }
    }

    async queryBrightIDSignature(contextId) {
        try {
            const userVerificationUrl = `${this.verificationUrl}/${this.context}/${contextId}?signed=eth&timestamp=seconds`;

            // console.log(userVerificationUrl);

            const request = new Request(userVerificationUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            });

            const response = await fetch(request);

            const body = await response.json();

            if (response.ok === false) {
                throw new Error(body.errorMessage);
            }

            return body;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    /* State Data Query */
    /* ---------------------------------------------------------------------- */

    async initWalletAddress() {
        try {
            console.log("initWalletAddress");

            this.walletAddress = await this.queryWalletAddress();

            return this.walletAddress;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initENSName() {
        try {
            this.ensName = await this.queryENSName();

            return this.ensName;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initChainId() {
        try {
            this.chainId = await this.queryChainId();

            return this.chainId;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initIsBrightIDLinked() {
        try {
            // const addr = await this.getWalletAddress();

            // this.isBrightIDLinked = await this.queryBrightIDLink(addr);

            this.isBrightIDLinked = true; // DEBUG

            return this.isBrightIDLinked;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initIsUUIDLinked() {
        try {
            this.isUUIDLinked = await this.queryBrightIDLink(this.uuidByte32);

            // this.isUUIDLinked = true; // DEBUG

            return this.isUUIDLinked;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initIsBoundViaContract() {
        try {
            // const addr = await this.getWalletAddress();

            // this.isBoundViaContract = await this.queryBrightIDVerification(
            //     addr
            // );

            this.isBoundViaContract = true; // DEBUG

            return this.isBoundViaContract;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initIsMintedViaContract() {
        try {
            this.isMintedViaContract = await this.queryTokenBalance();

            // this.isMintedViaContract = false; // DEBUG

            return this.isMintedViaContract;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    /* Interactive Events */
    /* ---------------------------------------------------------------------- */

    async connectWallet() {
        await this.initInstance();
    }

    async chooseWallet() {
        await this.initFreshInstance();
    }

    async getBindParams() {
        const contract = await this.getRegistrationProviderContract();
        const provider = await this.getProvider();

        console.log("Wallet Address");
        const addr = await this.getWalletAddress();
        console.log(addr);

        console.log("UUID Hash");
        const uuidHash = await contract.hashUUID(this.uuidByte32);
        console.log(uuidHash);

        console.log("nonce");
        const nonceBytes = ethers.utils.randomBytes(3);
        const nonce = new Buffer(nonceBytes).readUIntBE(0, nonceBytes.length);
        console.log(nonceBytes);
        console.log(nonce);

        console.log("getUUIDHash");
        const hashToSign = await contract.getUUIDHash(addr, uuidHash, nonce);
        console.log(hashToSign);

        console.log("signMessage");
        const bytesDataHash = ethers.utils.arrayify(hashToSign);
        const signature = await provider.getSigner().signMessage(bytesDataHash);
        console.log(signature);

        // console.log("done");
        console.log("pass to bind");
        console.log("--------------------------");
        console.log(addr);
        console.log(uuidHash);
        console.log(nonce);
        console.log(signature);
        console.log("--------------------------");

        return {
            addr,
            uuidHash,
            nonce,
            signature,
        };
    }

    async getMintParams() {
        const verificationData = await this.queryBrightIDSignature(
            this.uuidByte32
        );

        // const addrs = [addr];
        const contextIds = verificationData.data.contextIds;
        const timestamp = verificationData.data.timestamp;
        const v = verificationData.data.sig.v;
        const r = "0x" + verificationData.data.sig.r;
        const s = "0x" + verificationData.data.sig.s;

        console.log("-------------------------------");
        console.log(contextIds);
        console.log(timestamp);
        console.log(v);
        console.log(r);
        console.log(s);
        console.log("-------------------------------");

        return {
            contextIds,
            timestamp,
            v,
            r,
            s,
        };
    }

    async bindViaTransaction() {
        const chainId = await this.initChainId();

        if (chainId !== Number(this.mintChainId)) {
            throw new Error(
                `Please switch to "${this.mintChainName}" (chainId: ${this.mintChainId})`
            );
        }

        const bindParams = await this.getBindParams();

        const contract = await this.getContractRw();

        console.log("tx");
        const tx = await contract.bind(
            bindParams.addr,
            bindParams.uuidHash,
            bindParams.nonce,
            bindParams.signature
        );
        console.log(tx);

        console.log("receipt");
        const receipt = await tx.wait();
        console.log(receipt);

        return { ok: true };
    }

    async mintViaTransaction() {
        const chainId = await this.initChainId();

        if (chainId !== Number(this.mintChainId)) {
            throw new Error(
                `Please switch to the ${this.mintChainName} network (chainId: ${this.mintChainId}) first.`
            );
        }

        const mintParams = this.getMintParams();

        const contract = await this.getContractRw();

        const tx = await contract.mint(
            mintParams.contextIds,
            mintParams.timestamp,
            mintParams.v,
            mintParams.r,
            mintParams.s
        );

        console.log(tx);

        console.log("receipt");
        const receipt = await tx.wait();
        console.log(receipt);

        return { ok: true };
    }

    async bindViaRelay() {
        const bindParams = await this.getBindParams();

        const request = new Request(this.relayBindURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(bindParams),
        });

        return await fetch(request);
    }

    async mintViaRelay() {
        const mintParams = this.getMintParams();

        const request = new Request(this.relayMintURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(mintParams),
            // body: JSON.stringify({ uuid: this.uuidByte32 }),
        });

        return await fetch(request);
    }
}

export default BrightIDNftMintModel;

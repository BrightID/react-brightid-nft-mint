import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { randomBytes } from "crypto";

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

    brightIDLinkedWallets = [];

    isBrightIDLinked = false;

    isVerifiedViaContract = false;

    context = "";

    contractAddr = "";

    mainnetRpcUrl = "";

    walletConnectInfuraId = "";

    relayVerificationURL = "";

    appStoreAndroid = "";

    appStoreIos = "";

    brightIdMeetUrl = "";

    deepLinkPrefix = "";

    verificationUrl = "";

    constructor(
        context = "",
        contractAddr = "",
        mainnetRpcUrl = "",
        walletConnectInfuraId = "",
        relayVerificationURL = "",
        appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid",
        appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820",
        brightIdMeetUrl = "https://meet.brightid.org",
        deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org",
        registrationRpcUrl = "https://rpc.gnosischain.com/",
        verificationUrl = "https://app.brightid.org/node/v5/verifications"
    ) {
        this.context = context;
        this.contractAddr = contractAddr;
        this.mainnetRpcUrl = mainnetRpcUrl;
        this.walletConnectInfuraId = walletConnectInfuraId;
        this.relayVerificationURL = relayVerificationURL;

        this.appStoreAndroid = appStoreAndroid;
        this.appStoreIos = appStoreIos;
        this.brightIdMeetUrl = brightIdMeetUrl;
        this.deepLinkPrefix = deepLinkPrefix;
        this.registrationRpcUrl = registrationRpcUrl;
        this.verificationUrl = verificationUrl;
    }

    resetWalletData() {
        this.walletAddress = "";
        this.ensName = "";
        this.isBrightIDLinked = false;
        this.isVerifiedViaContract = false;
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
        return new ethers.providers.JsonRpcProvider(this.registrationRpcUrl);
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

    async queryBrightIDVerification(contextId) {
        try {
            console.log("queryBrightIDVerification");

            const addr = await this.getWalletAddress();

            const contract = await this.getRegistrationProviderContract();

            const isVerified = await contract.isVerifiedUser(addr);

            // console.log(isVerified);

            return isVerified;
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

    async initIsVerifiedViaContract() {
        try {
            // const addr = await this.getWalletAddress();

            // this.isVerifiedViaContract = await this.queryBrightIDVerification(
            //     addr
            // );

            // this.isVerifiedViaContract = true; // DEBUG

            return this.isVerifiedViaContract;
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

    async mintViaRelay() {
        const contract = await this.getRegistrationProviderContract();
        const contractRw = await this.getRegistrationProviderContractRw();
        const provider = await this.getProvider();

        // console.log("Wallet Address");
        // // const addr = await this.getWalletAddress();
        // const addr = "0xe031628c95Df01073E95b411388deB48f09F33AA";
        // console.log(addr);

        // console.log("UUID");
        // const uuid = crypto.randomUUID();
        // // const uuid = ethers.utils.randomBytes(16);
        // console.log(uuid);

        // console.log("UUID Hex");
        // const uuidHex = uuid.replaceAll("-", "");
        // // const uuidHex = new Buffer(uuid).toString("hex");
        // console.log(uuidHex);

        // console.log("UUID Bytes32");
        // // const uuidByte32 = ethers.utils.formatBytes32String(uuidHex);
        // const uuidByte32 = "0x" + new Buffer(uuidHex).toString("hex");
        // console.log(uuidByte32);

        // console.log("UUID Hash");
        // const uuidHash = await contract.hashUUID(uuidByte32);
        // console.log(uuidHash);

        // console.log("nonce");
        // const nonce = ethers.utils.randomBytes(32);
        // const nonceHex = "0x" + new Buffer(nonce).toString("hex");
        // const nonceDecimal = new Buffer(nonce).readUIntBE(0, nonce.length);
        // console.log(nonce);
        // console.log(nonceHex);
        // console.log(nonceDecimal);

        const addr = "0xe031628c95Df01073E95b411388deB48f09F33AA"; // DEBUG
        const uuidHash =
            "0x27d6dd660e7fb953dcccfbaf06bf63a8de568e9ad51af4e7e16f5532850d2850"; // DEBUG
        // const nonceHex =
        //     "0xd272af1dc749cc39e0d9994f0a710b47607c24d4ae4485eb19c032528b7f5931"; // DEBUG
        // const nonceDecimal =
        //     "95188327376307323746885050445706068406636006040718965432711697749307532728625"; // DEBUG
        const nonceDecimal = 100;

        console.log(addr);
        console.log(uuidHash);
        console.log(nonceDecimal);

        // console.log("getUUIDHash");
        const hashToSign = await contract.getUUIDHash(
            addr,
            uuidHash,
            nonceDecimal
        );
        console.log(hashToSign);

        const signature = await provider.getSigner().signMessage(hashToSign);
        console.log(signature);

        // const addr = "0xe031628c95Df01073E95b411388deB48f09F33AA"; // DEBUG
        // const uuidHash =
        //     "0x27d6dd660e7fb953dcccfbaf06bf63a8de568e9ad51af4e7e16f5532850d2850"; // DEBUG
        // const nonceHex =
        //     "0xd272af1dc749cc39e0d9994f0a710b47607c24d4ae4485eb19c032528b7f5931"; // DEBUG
        // const nonceDecimal =
        //     "95188327376307323746885050445706068406636006040718965432711697749307532728625"; // DEBUG
        // const signature =
        //     "0xb3d6e7e91fd2ccaec5d10bf12a316c5c578449fc05eea7f6d44ad1951f4e7d585d454adaee5d2ff91a1374961664cbb900a2304d5353c6d208199ac6385d0bdb1b"; // DEBUG

        // 0xe031628c95df01073e95b411388deb48f09f33aa;
        // 0x27d6dd660e7fb953dcccfbaf06bf63a8de568e9ad51af4e7e16f5532850d2850;
        // 100;

        // // 0x285d4ad86f379684028112820eb8db77ceafce70488fa14bffe0d1dbd1b2b02b;

        // 0x05e6b7a62517ee73b44ef1fd5221210d7e746bf5af66378a173f4186e06df1884c51fdc3a354eb89a5c9f67a80302b753881899aa539457863063209f58efaef1b;

        // 0xb9d52bbfa575fdf0b0dfee9fc09c5010feab98c9
        // 0x176a140ec81212f8fce448e90fa6abe0ff1ff6d466f1d37b619eb024ea05e134
        // 100
        // 0xe49c7b6bbdfe71a578d439586df18fa5814fe596b6f52ec1ba0c1f59b1e0a71e12ca8235cb273f38fcb5dd8857373ebe0805b456c3a99a2f81dbfed859e6100a1cz

        // console.log("done");
        // console.log("pass to bind");
        // console.log("--------------------------");
        // console.log(addr);
        // console.log(uuidHash);
        // console.log(nonceHex);
        // console.log(nonceDecimal);
        // console.log(signature);
        // console.log("--------------------------");
        // // const tx = await contractRw.bind(addr, uuidHash, nonce, signature);

        // // console.log(tx);

        return { ok: true };

        // const request = new Request(this.relayVerificationURL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json; charset=utf-8",
        //     },
        //     body: JSON.stringify({
        //         addr: addr,
        //         owner: addr,
        //         uuidHash: uuidHash,
        //         nonce: nonce,
        //         signature: signature,
        //     }),
        // });

        // return await fetch(request);
    }

    async verifyViaRelay() {
        return false;

        // const addr = await this.getWalletAddress();

        // const request = new Request(this.relayVerificationURL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json; charset=utf-8",
        //     },
        //     body: JSON.stringify({ addr: addr }),
        // });

        // return await fetch(request);
    }

    async signMessage() {
        const encoded = utils.defaultAbiCoder.encode(
            ["address", "uint256"],
            [
                "0xD0D801c1053555726bdCF188F4A55e690C440E74",
                // 1000000000000000000000,
                // 1000000000000000000
                1000,
            ]
        );
        console.log(encoded);

        const hash = utils.keccak256(encoded);
        console.log(hash);

        const provider = await this.getProvider();
        const signature = await provider.getSigner().signMessage(hash);

        var sig = await ethers.utils.splitSignature(signature);

        console.log(sig);
    }
}

export default BrightIDNftMintModel;

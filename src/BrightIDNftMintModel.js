import { ethers } from "ethers";
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
            name: "AddressBound",
            inputs: [
                {
                    type: "address",
                    name: "addr",
                    internalType: "address",
                    indexed: true,
                },
            ],
            anonymous: false,
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
            stateMutability: "pure",
            outputs: [{ type: "string", name: "", internalType: "string" }],
            name: "tokenURI",
            inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
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

    gasBalance = 0.0;

    totalSupply = 0;

    maxSupply = 0;

    brightIDLinkedWallets = [];

    isBrightIDLinked = false;

    isUUIDSigned = false;

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

    mintTokenFaucetUrl = "";

    mintChainId = 0;

    mintChainName = "";

    mintTokenDecimal = 0;

    mintTokenName = "";

    mintBlockExplorerUrl = "";

    mintBlockExplorerTxnPath = "";

    mintRpcUrl = "";

    verificationUrl = "";

    uuid = "";

    bindParams = null;

    constructor(
        statePrefix = "",
        context = "",
        contractAddr = "",
        mainnetRpcUrl = "",
        walletConnectInfuraId = "",
        relayBindURL = "",
        relayMintURL = "",
        maxSupply = 0,
        appStoreAndroid = "https://play.google.com/store/apps/details?id=org.brightid",
        appStoreIos = "https://apps.apple.com/us/app/brightid/id1428946820",
        brightIdMeetUrl = "https://meet.brightid.org",
        deepLinkPrefix = "brightid://link-verification/http:%2f%2fnode.brightid.org",
        mintTokenFaucetUrl = "https://www.gimlu.com/faucet",
        mintChainId = 100,
        mintChainName = "Gnosis Chain (formerly xDai)",
        mintTokenName = "xDAI",
        mintTokenDecimal = 18,
        mintBlockExplorerUrl = "https://blockscout.com/xdai/mainnet",
        mintBlockExplorerTxnPath = "/tx/",
        mintRpcUrl = "https://rpc.gnosischain.com",
        verificationUrl = "https://app.brightid.org/node/v5/verifications"
    ) {
        this.statePrefix = statePrefix;
        this.context = context;
        this.contractAddr = contractAddr;
        this.mainnetRpcUrl = mainnetRpcUrl;
        this.walletConnectInfuraId = walletConnectInfuraId;
        this.relayBindURL = relayBindURL;
        this.relayMintURL = relayMintURL;
        this.maxSupply = maxSupply;

        this.appStoreAndroid = appStoreAndroid;
        this.appStoreIos = appStoreIos;
        this.brightIdMeetUrl = brightIdMeetUrl;
        this.deepLinkPrefix = deepLinkPrefix;
        this.mintTokenFaucetUrl = mintTokenFaucetUrl;
        this.mintChainId = Number(mintChainId);
        this.mintChainName = mintChainName;
        this.mintTokenDecimal = Number(mintTokenDecimal);
        this.mintTokenName = mintTokenName;
        this.mintBlockExplorerUrl = mintBlockExplorerUrl;
        this.mintBlockExplorerTxnPath = mintBlockExplorerTxnPath;
        this.mintRpcUrl = mintRpcUrl;
        this.verificationUrl = verificationUrl;
    }

    resetWalletData() {
        this.walletAddress = "";
        this.ensName = "";
        this.chainId = 0;
        this.gasBalance = 0.0;
        this.isBrightIDLinked = false;
        this.isUUIDLinked = false;
        this.isUUIDSigned = false;
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
                    rpc: {},
                },
            },
        };

        providerOptions.walletconnect.options.rpc[this.mintChainId] =
            this.mintRpcUrl;

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
        return `${this.deepLinkPrefix}/${this.context}/${this.uuid}`;
    }

    async queryWalletAddress() {
        try {
            console.log("queryWalletAddress");

            const provider = await this.getProvider();

            const accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                throw new Error("No Wallet Address Found");
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

    async queryGasBalance() {
        try {
            console.log("checkGas");

            const addr = await this.getWalletAddress();

            const provider = await this.getRegistrationProvider();

            const balanceRaw = await provider.getBalance(addr);

            const balanceFormatted = await ethers.utils.formatEther(balanceRaw);

            return parseFloat(balanceFormatted);
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return 0.0;
        }
    }

    async queryTotalSupply() {
        try {
            console.log("queryTotalSupply");

            const contract = await this.getRegistrationProviderContract();

            const totalSupply = await contract.totalSupply();

            const totalSupplyDecimal = totalSupply.toString();

            // console.log(totalSupply);
            // console.log(totalSupplyDecimal);

            return totalSupplyDecimal;
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

            const contract = await this.getRegistrationProviderContract();

            const balance = await contract.balanceOf(addr);

            // console.log(balance);

            return balance;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            return 0;
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

    async initGasBalance() {
        try {
            this.gasBalance = await this.queryGasBalance();

            return this.gasBalance;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async initTotalSupply() {
        try {
            this.totalSupply = await this.queryTotalSupply();

            // this.totalSupply = 0; // DEBUG

            return this.totalSupply;
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    // -------------------------------------------------------------------------

    setCachedUUID(uuid) {
        sessionStorage.setItem(`${this.statePrefix}-uuid`, uuid);
    }

    getCachedUUID() {
        return sessionStorage.getItem(`${this.statePrefix}-uuid`);
    }

    removeCachedUUID() {
        sessionStorage.removeItem(`${this.statePrefix}-uuid`);
    }

    hasCachedUUID() {
        const uuid = this.getCachedUUID();

        return uuid !== null && uuid !== "";
    }

    restoreCachedUUID() {
        const uuid = this.getCachedUUID();

        this.uuid = uuid;
    }

    // -------------------------------------------------------------------------

    setCachedSignedUUID(bindParams) {
        const bindParamJson = JSON.stringify(bindParams);

        sessionStorage.setItem(
            `${this.statePrefix}-uuid-bind-params`,
            bindParamJson
        );
    }

    getCachedSignedUUID() {
        return sessionStorage.getItem(`${this.statePrefix}-uuid-bind-params`);
    }

    removeCachedSignedUUID() {
        sessionStorage.removeItem(`${this.statePrefix}-uuid-bind-params`);
    }

    hasCachedSignedUUID() {
        const paramsString = this.getCachedSignedUUID();

        return paramsString !== null && paramsString !== "";
    }

    restoreCachedSignedUUID() {
        const paramsString = this.getCachedSignedUUID();

        const params = JSON.parse(paramsString);

        this.bindParams = params;
    }

    // -------------------------------------------------------------------------

    hasUUID() {
        return this.uuid !== null && this.uuid !== "";
    }

    hasSignedUUID() {
        return (
            this.bindParams !== null &&
            typeof this.bindParams.addr !== "undefined" &&
            typeof this.bindParams.uuidHash !== "undefined" &&
            typeof this.bindParams.nonce !== "undefined" &&
            typeof this.bindParams.signature !== "undefined" &&
            this.bindParams.addr !== "" &&
            this.bindParams.uuidHash !== "" &&
            this.bindParams.nonce !== "" &&
            this.bindParams.signature !== ""
        );
    }

    async hasBoundUUID() {
        if (this.hasUUID() === false || this.hasSignedUUID() === false) {
            return false;
        }

        const addr = await this.queryWalletAddress();

        const uuidHash = await this.hashUUID(this.uuid);

        const bindParams = await this.getBindParams();

        if (bindParams.addr !== addr || bindParams.uuidHash !== uuidHash) {
            return false;
        }

        const provider = await this.getRegistrationProvider();
        const contract = await this.getContract();

        let filter = contract.filters.AddressBound(bindParams.addr);

        filter.fromBlock = 21019766;
        filter.toBlock = "latest";

        const abi = [
            "function bind(address owner, bytes32 uuidHash, uint256 nonce, bytes signature)",
        ];

        const iface = new ethers.utils.Interface(abi);

        const logs = await provider.getLogs(filter);
        // console.log(logs);

        const logsReversed = logs.reverse();

        for (let log of logsReversed) {
            const receipt = await provider.getTransactionReceipt(
                log.transactionHash
            );
            // console.log(receipt);

            const txn = await provider.getTransaction(log.transactionHash);
            // console.log(txn);

            const parsed = iface.parseTransaction(txn);
            // console.log(parsed);

            // console.log(bindParams.addr);
            // console.log(parsed.args[0]);

            // console.log(bindParams.uuidHash);
            // console.log(parsed.args[1]);

            if (
                receipt.blockNumber &&
                Number(receipt.status) === 1 &&
                bindParams.addr === parsed.args[0] &&
                bindParams.uuidHash === parsed.args[1]
            ) {
                return true;
            }
        }

        return false;
    }

    // -------------------------------------------------------------------------

    async initUUID() {
        try {
            const walletAddress = await this.queryWalletAddress();

            if (
                sessionStorage.getItem(`${this.statePrefix}-wallet`) !==
                walletAddress
            ) {
                sessionStorage.setItem(
                    `${this.statePrefix}-wallet`,
                    walletAddress
                );

                return await this.resetAndInitNewUUID();
            }

            this.restoreUUID();

            if (this.hasUUID() === false) {
                return await this.resetAndInitNewUUID();
            }
        } catch (e) {
            // console.error(e);
            // console.log(e);
            return await this.resetAndInitNewUUID();
        }
    }

    async restoreUUID() {
        this.restoreCachedUUID();
        this.restoreCachedSignedUUID();
    }

    async resetUUID() {
        this.removeCachedUUID();
        this.removeCachedSignedUUID();
        this.uuid = "";
        this.bindParams = null;
    }

    async initNewUUID() {
        this.uuid = this.generateUUID();

        this.setCachedUUID(this.uuid);
    }

    async resetAndInitNewUUID() {
        await this.resetUUID();
        await this.initNewUUID();
    }

    generateUUID() {
        // if (typeof crypto !== "undefined") {
        //     console.log("crypto.randomUUID");
        //     return crypto.randomUUID().replaceAll("-", "");
        // }

        const number = ethers.BigNumber.from(ethers.utils.randomBytes(16));
        const uuid = number.toHexString().replaceAll("0x", "");

        return uuid;
    }

    strToByte32(str) {
        return "0x" + new Buffer(str).toString("hex");
    }

    async hashUUID(uuid) {
        const contract = await this.getRegistrationProviderContract();

        const uuidByte32 = this.strToByte32(uuid);

        const uuidHash = await contract.hashUUID(uuidByte32);

        return uuidHash;
    }

    // -------------------------------------------------------------------------

    async initIsUUIDLinked() {
        try {
            this.isUUIDLinked = await this.queryBrightIDLink(this.uuid);

            // this.isUUIDLinked = true; // DEBUG

            return this.isUUIDLinked;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            this.isUUIDLinked = false;

            return this.isUUIDLinked;
        }
    }

    async initIsUUIDSigned() {
        try {
            this.isUUIDSigned = this.hasSignedUUID();

            // this.isUUIDSigned = true; // DEBUG

            return this.isUUIDSigned;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            this.isUUIDSigned = false;

            return this.isUUIDSigned;
        }
    }

    async initIsBoundViaContract() {
        try {
            this.isBoundViaContract = await this.hasBoundUUID();

            // this.isBoundViaContract = true; // DEBUG

            return this.isBoundViaContract;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            this.isBoundViaContract = false;

            return this.isBoundViaContract;
        }
    }

    async initIsMintedViaContract() {
        try {
            const balance = await this.queryTokenBalance();

            this.isMintedViaContract = balance > 0;

            // this.isMintedViaContract = false; // DEBUG

            return this.isMintedViaContract;
        } catch (e) {
            // console.error(e);
            // console.log(e);

            this.isMintedViaContract = false;

            return this.isMintedViaContract;
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

    async switchToMainnetNetwork() {
        const provider = await this.getProvider();

        return await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
        });
    }

    async switchToMintNetwork() {
        const mintHexChainId = ethers.utils.hexlify(Number(this.mintChainId));

        const provider = await this.getProvider();

        return await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: mintHexChainId }],
        });
    }

    async addMintNetwork() {
        const mintHexChainId = ethers.utils.hexlify(Number(this.mintChainId));

        const provider = await this.getProvider();

        return await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: mintHexChainId,
                    chainName: this.mintChainName,
                    nativeCurrency: {
                        name: this.mintTokenName,
                        symbol: this.mintTokenName,
                        decimals: this.mintTokenDecimal,
                    },
                    rpcUrls: [this.mintRpcUrl],
                    blockExplorerUrls: [this.mintBlockExplorerUrl],
                    // iconUrls: [this.mintIconUrl],
                },
            ],
        });
    }

    standardizeSignature(signature) {
        if (signature.slice(-2) === "00") {
            return signature.slice(0, -2) + "1b";
        }

        if (signature.slice(-2) === "01") {
            return signature.slice(0, -2) + "1c";
        }

        return signature;
    }

    async signBindParams() {
        const contract = await this.getRegistrationProviderContract();
        const provider = await this.getProvider();

        const addr = await this.getWalletAddress();
        // console.log("Wallet Address");
        // console.log(addr);

        const uuidHash = await this.hashUUID(this.uuid);
        // console.log("UUID Hash");
        // console.log(uuidHash);

        const nonceBytes = ethers.utils.randomBytes(3);
        const nonce = new Buffer(nonceBytes).readUIntBE(0, nonceBytes.length);
        // console.log("nonce");
        // console.log(nonceBytes);
        // console.log(nonce);

        const hashToSign = await contract.getUUIDHash(addr, uuidHash, nonce);
        // console.log("getUUIDHash");
        // console.log(hashToSign);

        const bytesDataHash = ethers.utils.arrayify(hashToSign);
        const rawSignature = await provider
            .getSigner()
            .signMessage(bytesDataHash);

        const signature = this.standardizeSignature(rawSignature);
        // console.log("signMessage");
        // console.log(rawSignature);
        // console.log(signature);

        // console.log("pass to bind");
        // console.log("--------------------------");
        // console.log(addr);
        // console.log(uuidHash);
        // console.log(nonce);
        // console.log(signature);
        // console.log("--------------------------");

        this.bindParams = {
            addr,
            uuidHash,
            nonce,
            signature,
        };

        this.setCachedSignedUUID(this.bindParams);

        return this.bindParams;
    }

    async getBindParams() {
        return this.bindParams;
    }

    async getMintParams() {
        const verificationData = await this.queryBrightIDSignature(this.uuid);

        const contextIds = verificationData.data.contextIds;
        const timestamp = verificationData.data.timestamp;
        const v = verificationData.data.sig.v;
        const r = "0x" + verificationData.data.sig.r;
        const s = "0x" + verificationData.data.sig.s;

        const contextIdsByte32 = contextIds.map((contextId) => {
            return this.strToByte32(contextId);
        });

        // console.log("pass to mint");
        // console.log("-------------------------------");
        // console.log(contextIds);
        // console.log(contextIdsByte32);
        // console.log(timestamp);
        // console.log(v);
        // console.log(r);
        // console.log(s);
        // console.log("-------------------------------");

        return {
            contextIds,
            contextIdsByte32,
            timestamp,
            v,
            r,
            s,
        };
    }

    async getTokenId(addr) {
        const provider = await this.getRegistrationProvider();
        const contract = await this.getContract();

        let filter = contract.filters.Transfer(null, addr);
        // filter.fromBlock = 0;
        filter.fromBlock = 21019766;

        const logs = await provider.getLogs(filter);

        if (logs.length === 0) {
            throw new Error(
                "No NFTs could be found at the provided rescue address."
            );
        }

        const lastLog = logs.pop();

        const tokenIdHex = lastLog.topics[3];

        const tokenId = parseInt(tokenIdHex, 16);

        // console.log(lastLog);
        // console.log(tokenIdHex);
        // console.log(tokenId);

        return tokenId;
    }

    async getRescueParams(rescueFrom) {
        const tokenId = await this.getTokenId(rescueFrom);

        const verificationData = await this.queryBrightIDSignature(this.uuid);

        const contextIds = verificationData.data.contextIds;
        const timestamp = verificationData.data.timestamp;
        const v = verificationData.data.sig.v;
        const r = "0x" + verificationData.data.sig.r;
        const s = "0x" + verificationData.data.sig.s;

        const contextIdsByte32 = contextIds.map((contextId) => {
            return this.strToByte32(contextId);
        });

        // console.log("pass to mint");
        // console.log("-------------------------------");
        // console.log(contextIds);
        // console.log(contextIdsByte32);
        // console.log(timestamp);
        // console.log(v);
        // console.log(r);
        // console.log(s);
        // console.log("-------------------------------");

        return {
            contextIds,
            contextIdsByte32,
            timestamp,
            tokenId,
            v,
            r,
            s,
        };
    }

    async getMintRelayParams() {
        const addr = await this.getWalletAddress();
        const uuid = this.uuid;

        // console.log("pass to mint relay");
        // console.log("-------------------------------");
        // console.log(addr);
        // console.log(uuid);
        // console.log("-------------------------------");

        return {
            addr,
            uuid,
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

        return await contract.bind(
            bindParams.addr,
            bindParams.uuidHash,
            bindParams.nonce,
            bindParams.signature
        );
    }

    async mintViaTransaction() {
        const chainId = await this.initChainId();

        if (chainId !== Number(this.mintChainId)) {
            throw new Error(
                `Please switch to the ${this.mintChainName} network (chainId: ${this.mintChainId}) first.`
            );
        }

        const mintParams = await this.getMintParams();

        const contract = await this.getContractRw();

        return await contract.mint(
            mintParams.contextIdsByte32,
            mintParams.timestamp,
            mintParams.v,
            mintParams.r,
            mintParams.s
        );
    }

    async rescueViaTransaction(rescueFrom) {
        const chainId = await this.initChainId();

        if (chainId !== Number(this.mintChainId)) {
            throw new Error(
                `Please switch to the ${this.mintChainName} network (chainId: ${this.mintChainId}) first.`
            );
        }

        const rescueParams = await this.getRescueParams(rescueFrom);

        const contract = await this.getContractRw();

        return await contract[
            "rescue(bytes32[],uint256,uint256,uint8,bytes32,bytes32)"
        ](
            rescueParams.contextIdsByte32,
            rescueParams.timestamp,
            rescueParams.tokenId,
            rescueParams.v,
            rescueParams.r,
            rescueParams.s
        );
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
        const mintParams = await this.getMintRelayParams();

        const request = new Request(this.relayMintURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(mintParams),
        });

        return await fetch(request);
    }

    async rescueViaRelay(rescueFrom) {
        throw new Error("Not implemented");
    }

    getSignErrorMessage(error) {
        const errorMessage = this.getErrorMessage(error);

        return this.decodeErrorMessage(errorMessage);
    }

    getBindErrorMessage(error) {
        const errorMessage = this.getErrorMessage(error);

        return this.decodeErrorMessage(errorMessage);
    }

    getMintErrorMessage(error) {
        const errorMessage = this.getErrorMessage(error);

        return this.decodeErrorMessage(errorMessage);
    }

    decodeErrorMessage(errorMessage) {
        if (errorMessage.slice(0, 9) === "Reverted ") {
            const errorCode = errorMessage.slice(9);

            const decodedMessage = ethers.utils.toUtf8String(errorCode);

            return decodedMessage;
        }

        return errorMessage;
    }

    getErrorMessage(error) {
        if (
            typeof error.data !== "undefined" &&
            typeof error.data.message !== "undefined" &&
            error.data.message.slice(0, 9) === "Reverted "
        ) {
            return error.data.message;
        }

        if (typeof error.message !== "undefined") {
            return error.message;
        }

        return error;
    }

    getIsUUIDAlreadyBoundError(error) {
        const errorMessage = this.getBindErrorMessage(error);

        return errorMessage.includes("UUID already bound");
    }

    getIsUUIDUnboundError(error) {
        const errorMessage = this.getMintErrorMessage(error);

        // return errorMessage.includes("This BrightID had minted"); // DEBUG

        return errorMessage.includes("balance query for the zero address");
    }
}

export default BrightIDNftMintModel;

import "./BrightIDNftMint.css";
import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import BrightIDNftMintModel from "./BrightIDNftMintModel";
import DeepLinker from "./DeepLinker";

let registration;

let changePollingInterval = 0;

function BrightIDNftRescue({
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
    verificationUrl = "https://app.brightid.org/node/v5/verifications",
}) {
    /* State */
    /* ---------------------------------------------------------------------- */

    const statePrefix = "brightid-nft-rescue";

    const firstUpdate = useRef(true);

    const [allowBindRetry, setAllowBindRetry] = useState(false);

    const [allowMode, setAllowMode] = useState(false);

    const [mode, setMode] = useState("");

    const [uuidHex, setUUIDHex] = useState("");

    const [walletAddress, setWalletAddress] = useState("");

    const [ensName, setENSName] = useState("");

    const [chainId, setChainId] = useState("");

    const [gasBalance, setGasBalance] = useState(0.0);

    const [alreadyHoldsToken, setAlreadyHoldsToken] = useState(false);

    const [canAutoSwitchNetworks, setCanAutoSwitchNetworks] = useState(false);

    const [qrCodeUUIDUrl, setQrCodeUUIDUrl] = useState("");

    const [isUUIDLinked, setIsUUIDLinked] = useState(false);

    const [isUUIDSigned, setIsUUIDSigned] = useState(false);

    const [isBoundViaContract, setIsBoundViaContract] = useState(false);

    const [isMintedViaContract, setIsMintedViaContract] = useState(false);

    const [stepConnectWalletError, setStepConnectWalletError] = useState("");

    const [stepSignUUIDError, setStepSignUUIDError] = useState("");

    const [stepBindViaRelayStatus, setStepBindViaRelayStatus] = useState("");

    const [stepBindViaRelayError, setStepBindViaRelayError] = useState("");

    const [stepRescueViaRelayStatus, setStepRescueViaRelayStatus] =
        useState("");

    const [stepRescueViaRelayError, setStepRescueViaRelayError] = useState("");

    const [linkUUIDToBrightIDError, setLinkUUIDToBrightIDError] = useState("");

    const [stepSwitchToMintNetworkError, setStepSwitchToMintNetworkError] =
        useState("");

    const [stepBoundViaContractError, setStepBoundViaContractError] =
        useState("");

    const [
        isBoundViaContractTxnProcessing,
        setIsBoundViaContractTxnProcessing,
    ] = useState(false);

    const [isBoundViaContractTxnId, setIsBoundViaContractTxnId] =
        useState(null);

    const [stepMintedViaContractError, setStepMintedViaContractError] =
        useState("");

    const [
        isMintedViaContractTxnProcessing,
        setIsMintedViaContractTxnProcessing,
    ] = useState(false);

    const [isMintedViaContractTxnId, setIsMintedViaContractTxnId] =
        useState(null);

    const [stepSignUUIDProcessing, setStepSignUUIDProcessing] = useState(false);

    const [stepBindViaRelayProcessing, setStepBindViaRelayProcessing] =
        useState(false);

    const [boundViaContractChecking, setBoundViaContractChecking] =
        useState(false);

    const [stepRescueViaRelayProcessing, setStepRescueViaRelayProcessing] =
        useState(false);

    const [rescueAddress, setRescueAddress] = useState("");

    /* Web3 Data Init & Monitoring */
    /* ---------------------------------------------------------------------- */

    async function onAccountDisconnect() {
        resetWalletData();
        setMode("");
        setAllowMode(false);
        setUUIDHex("");
        setWalletAddress("");
        setENSName("");
        setChainId("");
        setGasBalance("");
        setCanAutoSwitchNetworks("");
        setQrCodeUUIDUrl("");
        setIsUUIDLinked("");
        setIsUUIDSigned(false);
        setIsBoundViaContract(false);
        setIsMintedViaContract(false);
    }

    async function onAccountChange() {
        resetWalletData();
        initAllowMode();
        await checkIfAlreadyHoldsNFT();
        await registration.initUUID();
        initUUIDHex();
        initWalletAddress();
        initENSName();
        initChainId();
        initGasBalance();
        initCanAutoSwitchNetworks();
        initQrCodeUUIDUrl();
        initIsUUIDLinked();
        initIsUUIDSigned();
        initIsBoundViaContract();
        initIsMintedViaContract();
    }

    function onChainChanged() {
        initChainId();
    }

    function onChangePolling() {
        if (registration.gasBalance === 0 || registration.gasBalance === 0.0) {
            initGasBalance();
        }

        // if (registration.isBoundViaContract === false) {
        //     initIsBoundViaContract();
        // }

        if (
            registration.isBoundViaContract === true &&
            registration.isUUIDLinked === false
        ) {
            initIsUUIDLinked();
        }

        if (registration.isMintedViaContract === false) {
            initIsMintedViaContract();
        }
    }

    function removeEvents() {
        console.log("remove events");

        if (typeof registration.web3Instance === "object") {
            registration.web3Instance.removeListener(
                "accountsChanged",
                onAccountChange
            );

            registration.web3Instance.removeListener(
                "chainChanged",
                onChainChanged
            );
        }

        if (changePollingInterval) {
            clearInterval(changePollingInterval);
        }
    }

    function addEvents() {
        console.log("add events");

        if (typeof registration.web3Instance === "object") {
            registration.web3Instance.on("accountsChanged", onAccountChange);

            registration.web3Instance.on("chainChanged", onChainChanged);
        }

        changePollingInterval = setInterval(onChangePolling, 5000);
    }

    /* State Data Query */
    /* ---------------------------------------------------------------------- */

    // async function resetUUID() {
    //     try {
    //         console.log("reset");
    //         await registration.resetUUID();

    //         setUUIDHex(registration.uuidHex);

    //         await initIsBoundViaContract();

    //         initIsUUIDLinked();
    //     } catch (e) {
    //         // console.error(e);
    //         // console.log(e);
    //     }
    // }

    async function checkIfAlreadyHoldsNFT() {
        const tokenBalance = await registration.queryTokenBalance();

        const holdsToken = tokenBalance > 0;

        setAlreadyHoldsToken(holdsToken);
    }

    async function resetWalletData() {
        try {
            await registration.resetWalletData();
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initWalletAddress() {
        try {
            const walletAddress = await registration.initWalletAddress();

            setWalletAddress(walletAddress);
            setStepConnectWalletError("");
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initUUIDHex() {
        try {
            setUUIDHex(registration.uuid);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initENSName() {
        try {
            const ensName = await registration.initENSName();

            setENSName(ensName);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initChainId() {
        try {
            const chainId = await registration.initChainId();

            setChainId(chainId);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initGasBalance() {
        try {
            const gasBalance = await registration.initGasBalance();

            setGasBalance(gasBalance);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initCanAutoSwitchNetworks() {
        try {
            const canAutoSwitchNetworks =
                await registration.canAutoSwitchNetworks();

            setCanAutoSwitchNetworks(canAutoSwitchNetworks);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initQrCodeUUIDUrl() {
        try {
            const qrCodeUUIDUrl = await registration.getQrCodeUUIDUrl();

            setQrCodeUUIDUrl(qrCodeUUIDUrl);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initIsUUIDLinked() {
        try {
            const isUUIDLinked = await registration.initIsUUIDLinked();

            setIsUUIDLinked(isUUIDLinked);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initIsUUIDSigned() {
        try {
            const isUUIDSigned = await registration.initIsUUIDSigned();

            // console.log(isUUIDSigned);

            setIsUUIDSigned(isUUIDSigned);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    async function initIsBoundViaContract() {
        try {
            setBoundViaContractChecking(true);

            const isBoundViaContract =
                await registration.initIsBoundViaContract();

            // console.log(isBoundViaContract);

            setIsBoundViaContract(isBoundViaContract);
            setBoundViaContractChecking(false);
        } catch (e) {
            // console.error(e);
            // console.log(e);
            setBoundViaContractChecking(false);
        }
    }

    async function initIsMintedViaContract() {
        try {
            const isMintedViaContract =
                await registration.initIsMintedViaContract();

            // console.log(isMintedViaContract);

            setIsMintedViaContract(isMintedViaContract);
        } catch (e) {
            // console.error(e);
            // console.log(e);
        }
    }

    /* Interactive Events */
    /* ---------------------------------------------------------------------- */

    function linkUUIDToBrightID() {
        // window.open(qrCodeUUIDUrl);

        var url = qrCodeUUIDUrl;

        if (url === "") {
            return;
        }

        var linker = new DeepLinker({
            onIgnored: function () {
                console.log("browser failed to respond to the deep link");

                setLinkUUIDToBrightIDError(
                    "Couldn't open BrightID. Scan the QR code below with the device you have BrightID installed on."
                );
            },
            onFallback: function () {
                console.log("dialog hidden or user returned to tab");
            },
            onReturn: function () {
                console.log("user returned to the page from the native app");
            },
        });

        linker.openURL(url);
    }

    async function initRegistration() {
        if (typeof registration === "object") {
            return;
        }

        console.log("initRegistration");

        // Initialize registration class.
        registration = new BrightIDNftMintModel(
            statePrefix,
            context,
            contractAddr,
            mainnetRpcUrl,
            walletConnectInfuraId,
            relayBindURL,
            relayMintURL,
            maxSupply,
            appStoreAndroid,
            appStoreIos,
            brightIdMeetUrl,
            deepLinkPrefix,
            mintTokenFaucetUrl,
            mintChainId,
            mintChainName,
            mintTokenName,
            mintTokenDecimal,
            mintBlockExplorerUrl,
            mintBlockExplorerTxnPath,
            mintRpcUrl,
            verificationUrl
        );
    }

    async function init() {
        await initRegistration();

        // Restore mode
        // restoreMode(); // TEMP DISABLE GAS CHOICE

        // Reconnect on Load
        reconnectWallet();
    }

    async function initAllowMode() {
        // const gasBalance = await registration.initGasBalance();

        // if (gasBalance) {
        //     setAllowMode(false);
        //     setModeGas();
        // } else {
        //     setAllowMode(true);
        // }

        setAllowMode(false); // TEMP DISABLE GAS CHOICE
        setModeGas(); // TEMP DISABLE GAS CHOICE
    }

    async function reconnectWallet() {
        await initRegistration();

        if (registration.hasReconnectableWallet()) {
            connectWallet();
        }
    }

    async function connectWallet() {
        try {
            setStepConnectWalletError("");
            await initRegistration();
            removeEvents();
            await registration.connectWallet();
            addEvents();
            onAccountChange();
        } catch (e) {
            // console.error(e);
            // console.log(e);

            onAccountDisconnect();

            if (e.message === "User Rejected") {
                setStepConnectWalletError("Unlock your wallet to continue");
            } else {
                setStepConnectWalletError(e.message);
            }
        }
    }

    async function chooseWallet() {
        try {
            setStepConnectWalletError("");
            await initRegistration();
            removeEvents();
            await registration.chooseWallet();
            addEvents();
            onAccountChange();
        } catch (e) {
            // console.error(e);
            // console.log(e);

            onAccountDisconnect();

            if (e.message === "User Rejected") {
                setStepConnectWalletError("Unlock your wallet to continue");
            } else {
                setStepConnectWalletError(e.message);
            }
        }
    }

    async function handleRescueAddressChange(event) {
        setRescueAddress(event.target.value);
    }

    async function getRescueAddress() {
        return rescueAddress;
    }

    async function faucetClaim() {
        window.open(mintTokenFaucetUrl, "_blank");
    }

    async function switchToMintNetwork() {
        try {
            await registration.switchToMintNetwork();

            setStepSwitchToMintNetworkError("");
        } catch (switchError) {
            // console.log(switchError);

            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                addMintNetwork();

                return;
            }

            // console.error(switchError);
            // console.log(switchError);

            setStepSwitchToMintNetworkError(switchError.message);
        }
    }

    async function switchToMainnetNetwork() {
        try {
            await registration.switchToMainnetNetwork();
        } catch (switchError) {
            // console.error(switchError);
            // console.log(switchError);
        }
    }

    async function addMintNetwork() {
        try {
            await registration.addMintNetwork();

            setStepSwitchToMintNetworkError("");
        } catch (addError) {
            // console.error(addError);
            // console.log(addError);

            setStepSwitchToMintNetworkError(addError.message);
        }
    }

    async function signUUID() {
        try {
            setStepSignUUIDProcessing(true);

            await registration.signBindParams();

            await initIsUUIDSigned();

            setStepSignUUIDError("");
            setStepSignUUIDProcessing(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            await initIsUUIDSigned();

            const errorMessage = registration.getSignErrorMessage(e);
            setStepSignUUIDError(errorMessage);
            setStepSignUUIDProcessing(false);
        }
    }

    async function handleUUIDAlreadyBoundError() {
        setStepBoundViaContractError("");
        setIsBoundViaContractTxnProcessing(false);
        setIsBoundViaContractTxnId(null);
        setStepBindViaRelayProcessing(false);

        try {
            await initIsBoundViaContract();

            if (registration.isBoundViaContract === false) {
                throw new Error("Transaction failed. Please try again.");
            }
        } catch (e) {
            const errorMessage = registration.getBindErrorMessage(e);
            setStepBoundViaContractError(errorMessage);
        }
    }

    async function bindViaTransaction(isRetry = false) {
        try {
            setStepBindViaRelayProcessing(true);

            const tx = await registration.bindViaTransaction();

            setIsBoundViaContractTxnProcessing(true);
            setIsBoundViaContractTxnId(tx.hash);
            setStepBoundViaContractError("");

            // wait for the transaction to be mined
            const receipt = await tx.wait();

            if (!receipt.blockNumber || Number(receipt.status) !== 1) {
                throw new Error("Transaction failed. Please try again.");
            }

            await initIsBoundViaContract();

            if (registration.isBoundViaContract === false) {
                throw new Error("Transaction failed. Please try again.");
            }

            setStepBoundViaContractError("");
            setIsBoundViaContractTxnProcessing(false);
            setIsBoundViaContractTxnId(null);
            setStepBindViaRelayProcessing(false);

            setAllowBindRetry(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            if (
                isRetry === false &&
                registration.getIsUUIDAlreadyBoundError(e)
            ) {
                handleUUIDAlreadyBoundError();

                return;
            }

            await initIsBoundViaContract();

            const errorMessage = registration.getBindErrorMessage(e);
            setStepBoundViaContractError(errorMessage);
            setIsBoundViaContractTxnProcessing(false);
            setIsBoundViaContractTxnId(null);
            setStepBindViaRelayProcessing(false);

            setAllowBindRetry(false);
        }
    }

    async function bindViaRelay(isRetry = false) {
        try {
            setStepBindViaRelayProcessing(true);

            setStepBindViaRelayStatus(
                "We're binding your UUID.  This could take a minute or two. Please wait."
            );

            const response = await registration.bindViaRelay();

            if (response.ok === false) {
                const body = await response.json();

                // console.log(body);
                // console.log(body.error);
                // console.log(body.error.message);

                throw new Error(body.error.message);
            }

            await initIsBoundViaContract();

            setStepBindViaRelayError("");
            setStepBindViaRelayStatus("");
            setStepBindViaRelayProcessing(false);

            setAllowBindRetry(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            if (
                isRetry === false &&
                registration.getIsUUIDAlreadyBoundError(e)
            ) {
                handleUUIDAlreadyBoundError();

                return;
            }

            await initIsBoundViaContract();

            const errorMessage = registration.getBindErrorMessage(e);
            setStepBindViaRelayError(errorMessage);
            setStepBindViaRelayStatus("");
            setStepBindViaRelayProcessing(false);

            setAllowBindRetry(false);
        }
    }

    async function rescueViaTransaction() {
        try {
            setStepRescueViaRelayProcessing(true);

            const rescueFrom = await getRescueAddress();

            if (!rescueFrom) {
                throw new Error(
                    "Please enter a wallet address to rescue from."
                );
            }

            const tx = await registration.rescueViaTransaction(rescueFrom);

            setIsMintedViaContractTxnProcessing(true);
            setIsMintedViaContractTxnId(tx.hash);
            setStepMintedViaContractError("");

            // wait for the transaction to be mined
            const receipt = await tx.wait();

            if (!receipt.blockNumber || Number(receipt.status) !== 1) {
                throw new Error("Transaction failed. Please try again.");
            }

            await initIsMintedViaContract();

            setStepMintedViaContractError("");
            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepRescueViaRelayProcessing(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            await initIsMintedViaContract();

            const errorMessage = registration.getMintErrorMessage(e);
            setStepMintedViaContractError(errorMessage);
            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepRescueViaRelayProcessing(false);

            if (registration.getIsUUIDUnboundError(e)) {
                setAllowBindRetry(true);
            }
        }
    }

    async function rescueViaRelay() {
        try {
            setStepRescueViaRelayProcessing(true);

            setStepRescueViaRelayStatus(
                "We're rescuing your NFT.  This could take a minute or two. Please wait."
            );

            const rescueFrom = await getRescueAddress();

            if (!rescueFrom) {
                throw new Error(
                    "Please enter a wallet address to rescue from."
                );
            }

            const response = await registration.rescueViaRelay(rescueFrom);

            if (response.ok === false) {
                const body = await response.json();

                // console.log(body);
                // console.log(body.error);
                // console.log(body.error.message);

                throw new Error(body.error.message);
            }

            await initIsMintedViaContract();

            setStepRescueViaRelayError("");
            setStepRescueViaRelayStatus("");
            setStepRescueViaRelayProcessing(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            await initIsMintedViaContract();

            const errorMessage = registration.getMintErrorMessage(e);
            setStepRescueViaRelayError(errorMessage);
            setStepRescueViaRelayStatus("");
            setStepRescueViaRelayProcessing(false);

            if (registration.getIsUUIDUnboundError(e)) {
                setAllowBindRetry(true);
            }
        }
    }

    /* Step State Checks */
    /* ---------------------------------------------------------------------- */

    function restoreMode() {
        if (sessionStorage.getItem(`${statePrefix}-mode`) !== null) {
            const mode = sessionStorage.getItem(`${statePrefix}-mode`);

            setMode(mode);
        }
    }

    function changeMode(mode) {
        sessionStorage.setItem(`${statePrefix}-mode`, mode);

        setMode(mode);
    }

    function setModeGas() {
        changeMode("gas");
    }

    function setModeGasless() {
        changeMode("gasless");
    }

    function hasRelay() {
        return mode === "gasless";
    }

    function hasConnectedWallet() {
        return walletAddress !== "";
    }

    function hasSignedUUID() {
        return isUUIDSigned === true;
    }

    function hasUUIDLinked() {
        return isUUIDLinked === true;
    }

    function hasBoundViaContract() {
        return isBoundViaContract === true;
    }

    function hasMintedViaContract() {
        return isMintedViaContract === true;
    }

    function hasSwitchedToMintNetwork() {
        return chainId === Number(mintChainId);
    }

    function hasObtainedGasTokens() {
        return gasBalance > 0;
    }

    function hasModeSelection() {
        return stepConnectWalletComplete() && allowMode;
    }

    function hasModeSelected() {
        return stepConnectWalletComplete() && mode !== "";
    }

    /* Step Completion Flags */
    /* ---------------------------------------------------------------------- */

    function getStepCompleteString(status) {
        return status === true ? "complete" : "incomplete";
    }

    function stepConnectWalletComplete() {
        return hasConnectedWallet();
    }

    function stepSwitchToMintNetworkComplete() {
        return hasSwitchedToMintNetwork();
    }

    function stepObtainGasTokensComplete() {
        return hasObtainedGasTokens();
    }

    function stepSignUUIDComplete() {
        return hasSignedUUID();
    }

    function stepUUIDLinkedComplete() {
        return hasUUIDLinked();
    }

    function stepBindViaRelayComplete() {
        return hasBoundViaContract() && boundViaContractChecking === false;
    }

    function stepRescueViaRelayComplete() {
        return hasMintedViaContract();
    }

    /* Step Active Flags */
    /* ---------------------------------------------------------------------- */

    function getStepActiveString(status) {
        return status === true ? "active" : "inactive";
    }

    function stepConnectWalletActive() {
        return true;
    }

    function stepSwitchToMintNetworkActive() {
        return stepConnectWalletActive();
    }

    function stepObtainGasTokensActive() {
        return (
            stepSwitchToMintNetworkComplete() && stepSwitchToMintNetworkActive()
        );
    }

    function stepSignUUIDActive() {
        return (
            (hasRelay() &&
                stepConnectWalletComplete() &&
                stepConnectWalletActive()) ||
            (!hasRelay() &&
                stepObtainGasTokensComplete() &&
                stepObtainGasTokensActive())
        );
    }

    function stepBindViaRelayActive() {
        return stepSignUUIDComplete() && stepSignUUIDActive();
    }

    function stepUUIDLinkedActive() {
        return stepBindViaRelayComplete() && stepBindViaRelayActive();
    }

    function stepRescueViaRelayActive() {
        return stepUUIDLinkedComplete() && stepUUIDLinkedActive();
    }

    /* Bootstrap */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (firstUpdate.current === false) {
            return;
        }

        if (firstUpdate.current) {
            firstUpdate.current = false;
        }

        init();
    });

    /* Template */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="brightid-nft-mint">
            <div>
                <section className={`brightid-nft-mint-step`}>
                    <div className="brightid-nft-mint-step__main">
                        <div className="brightid-nft-mint-step__header">
                            <h2 className="brightid-nft-mint-step__heading">
                                Rescuing a BrightID Soulbound NFT
                            </h2>
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__description">
                        <p className="brightid-nft-mint-step__description-p">
                            To rescue your BrightID Soulbound NFT you'll perform
                            a 'rescue' process that will allow you to transfer
                            your soulbound NFT from a lost or compromised wallet
                            to a new wallet of your choice. This is made
                            possible by using the BrightID verification system
                            to assure that only the owner of the BrightID
                            account that minted the NFT can rescue it to a new
                            wallet.
                        </p>
                        <p className="brightid-nft-mint-step__description-p">
                            To execute the rescue you'll need to perform the
                            tasks below with the{" "}
                            <strong>
                                wallet you want to rescue the NFT to
                            </strong>{" "}
                            (not the lost wallet holding it).
                        </p>
                    </div>
                </section>

                <section
                    className={`
                        brightid-nft-mint-step
                        brightid-nft-mint-step--connect
                        brightid-nft-mint-step--${getStepCompleteString(
                            stepConnectWalletComplete()
                        )}
                        brightid-nft-mint-step--${getStepActiveString(
                            stepConnectWalletActive()
                        )}
                    `}
                >
                    <div className="brightid-nft-mint-step__main">
                        <div className="brightid-nft-mint-step__status">
                            <div className="brightid-nft-mint-step__status-icon"></div>
                        </div>
                        <div className="brightid-nft-mint-step__header">
                            <h2 className="brightid-nft-mint-step__heading">
                                Connect Wallet
                            </h2>
                        </div>
                        <div className="brightid-nft-mint-step__action">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => chooseWallet()}
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__description">
                        {ensName && (
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>ENS: </strong>
                                <span className="brightid-nft-mint-step__description-ens-address">
                                    {ensName}
                                </span>
                            </p>
                        )}
                        {walletAddress && (
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>Address: </strong>
                                <span className="brightid-nft-mint-step__description-wallet-address">
                                    {walletAddress}
                                </span>
                            </p>
                        )}
                        {!walletAddress && (
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>Address: </strong>
                                <span>Not Connected</span>
                            </p>
                        )}
                    </div>
                    <div className="brightid-nft-mint-step__feedback">
                        {stepConnectWalletError && (
                            <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                {stepConnectWalletError}
                            </div>
                        )}
                    </div>
                </section>

                {alreadyHoldsToken && (
                    <section className={`brightid-nft-mint-step`}>
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Wallet Already Holds NFT
                                </h2>
                            </div>
                        </div>
                        <div className="brightid-nft-mint-step__description">
                            <p className="brightid-nft-mint-step__description-p">
                                It looks like this wallet already holds a
                                BrightID Soulbound NFT. Only a wallet that
                                doesn't already have an NFT can be used to
                                rescue a lost NFT.
                            </p>
                        </div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelection() && (
                    <section className={`brightid-nft-mint-step`}>
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Select the type of experience.
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action">
                                <button
                                    className="brightid-nft-mint-step__button"
                                    onClick={() => setModeGas()}
                                >
                                    Gas
                                </button>
                                <button
                                    className="brightid-nft-mint-step__button"
                                    onClick={() => setModeGasless()}
                                >
                                    Gasless
                                </button>
                            </div>
                        </div>
                        <div className="brightid-nft-mint-step__description">
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>gas:</strong> you'll execute
                                transactions on Gnosis Chain using xDAI for gas.
                            </p>
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>gasless:</strong> We'll cover the gas
                                fees for you, but you may experience rate
                                limits.
                            </p>
                        </div>
                        {mode && (
                            <div className="brightid-nft-mint-step__description">
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>
                                        Current Mode:{" "}
                                        <span className="brightid-nft-mint-step__important">
                                            {mode}
                                        </span>
                                    </strong>
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && !hasRelay() && (
                    <section
                        className={`
                            brightid-nft-mint-step
                            brightid-nft-mint-step--${getStepCompleteString(
                                stepSwitchToMintNetworkComplete()
                            )}
                            brightid-nft-mint-step--${getStepActiveString(
                                stepSwitchToMintNetworkActive()
                            )}
                        `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Switch Wallet to {mintChainName}
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action">
                                {canAutoSwitchNetworks && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => switchToMintNetwork()}
                                    >
                                        Switch
                                    </button>
                                )}
                            </div>
                        </div>
                        {stepConnectWalletComplete() && !canAutoSwitchNetworks && (
                            <div
                                className="
                                    brightid-nft-mint-step__description
                                    brightid-nft-mint-step__description--action
                                    brightid-nft-mint-step__description--action-hide-on-complete
                                "
                            >
                                <p className="brightid-nft-mint-step__description-p">
                                    In your wallet app create a new network with
                                    the following data and switch to that
                                    network.
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>Network Name: </strong>
                                    {mintChainName}
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>RPC URL: </strong>
                                    {mintRpcUrl}
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>Chain ID: </strong>
                                    {mintChainId}
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>Currency Symbol: </strong>
                                    {mintTokenName}
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>Block Explorer URL: </strong>
                                    {mintBlockExplorerUrl}
                                </p>
                            </div>
                        )}
                        <div className="brightid-nft-mint-step__feedback">
                            {stepSwitchToMintNetworkError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepSwitchToMintNetworkError}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && !hasRelay() && (
                    <section
                        className={`
                            brightid-nft-mint-step
                            brightid-nft-mint-step--${getStepCompleteString(
                                stepObtainGasTokensComplete()
                            )}
                            brightid-nft-mint-step--${getStepActiveString(
                                stepObtainGasTokensActive()
                            )}
                        `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Obtain {mintTokenName} Gas Tokens
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action">
                                {stepSwitchToMintNetworkComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => faucetClaim()}
                                    >
                                        Obtain
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="brightid-nft-mint-step__description">
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>Balance: </strong>
                                <span className="brightid-nft-mint-step__description-balance">
                                    {gasBalance} {mintTokenName}
                                </span>
                            </p>
                        </div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && (
                    <section
                        className={`
                            brightid-nft-mint-step
                            brightid-nft-mint-step--${getStepCompleteString(
                                stepSignUUIDComplete()
                            )}
                            brightid-nft-mint-step--${getStepActiveString(
                                stepSignUUIDActive()
                            )}
                        `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Sign UUID
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action">
                                {stepConnectWalletComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => signUUID()}
                                        disabled={
                                            stepSignUUIDProcessing ? true : null
                                        }
                                    >
                                        Sign
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="brightid-nft-mint-step__description">
                            <p className="brightid-nft-mint-step__description-p">
                                In this step you will be asked to sign a hash of
                                the UUID below with your wallet.
                            </p>
                            {uuidHex && (
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>UUID: </strong>
                                    <span className="brightid-nft-mint-step__description-wallet-address">
                                        {uuidHex}
                                    </span>

                                    {/*
                                    <span className="brightid-nft-mint-step__description-reset">
                                        If you have issues with this UUID you
                                        can reset it.
                                    </span>
                                    <button
                                        className="brightid-nft-mint-step__button brightid-nft-mint-step__button--small"
                                        onClick={() => resetUUID()}
                                    >
                                        Reset
                                    </button>
                                    */}
                                </p>
                            )}
                        </div>
                        <div className="brightid-nft-mint-step__feedback">
                            {stepSignUUIDError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepSignUUIDError}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && (
                    <section
                        className={`
                            brightid-nft-mint-step
                            brightid-nft-mint-step--${getStepCompleteString(
                                stepBindViaRelayComplete()
                            )}
                            brightid-nft-mint-step--${getStepActiveString(
                                stepBindViaRelayActive()
                            )}
                        `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Bind UUID
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action">
                                {hasRelay() && stepConnectWalletComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => bindViaRelay(false)}
                                        disabled={
                                            stepBindViaRelayProcessing ||
                                            boundViaContractChecking
                                                ? true
                                                : null
                                        }
                                    >
                                        Bind
                                    </button>
                                )}
                                {!hasRelay() && stepConnectWalletComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() =>
                                            bindViaTransaction(false)
                                        }
                                        disabled={
                                            stepBindViaRelayProcessing ||
                                            boundViaContractChecking
                                                ? true
                                                : null
                                        }
                                    >
                                        Bind
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="brightid-nft-mint-step__feedback">
                            {stepBindViaRelayStatus && (
                                <div className="brightid-nft-mint-step__response">
                                    <div className="brightid-nft-mint-step__response-loading-icon">
                                        <div className="brightid-nft-mint-step__loading-icon">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="brightid-nft-mint-step__response-message">
                                        <div>{stepBindViaRelayStatus}</div>
                                    </div>
                                </div>
                            )}
                            {!stepBindViaRelayProcessing &&
                                boundViaContractChecking && (
                                    <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--status">
                                        Checking to see if UUID is already
                                        bound. Please wait.
                                    </div>
                                )}
                            {stepBindViaRelayError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepBindViaRelayError}
                                </div>
                            )}
                            {isBoundViaContractTxnProcessing && (
                                <div className="brightid-nft-mint-step__response">
                                    <div className="brightid-nft-mint-step__response-loading-icon">
                                        <div className="brightid-nft-mint-step__loading-icon">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="brightid-nft-mint-step__response-message">
                                        <div>
                                            Transaction is being processed...
                                        </div>
                                        <div>
                                            <a
                                                className="brightid-nft-mint-step__response-link"
                                                href={`${mintBlockExplorerUrl}${mintBlockExplorerTxnPath}${isBoundViaContractTxnId}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Transaction
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {stepBoundViaContractError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepBoundViaContractError}
                                </div>
                            )}
                            {stepBindViaRelayComplete() && (
                                <div className="brightid-nft-mint-step__description">
                                    <p className="brightid-nft-mint-step__description-p">
                                        <strong>
                                            Your UUID has been bound.
                                        </strong>
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && (
                    <section
                        className={`
                            brightid-nft-mint-step
                            brightid-nft-mint-step--brightid-link
                            brightid-nft-mint-step--${getStepCompleteString(
                                stepUUIDLinkedComplete()
                            )}
                            brightid-nft-mint-step--${getStepActiveString(
                                stepUUIDLinkedActive()
                            )}
                        `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Link UUID to BrightID
                                </h2>
                            </div>
                        </div>
                        {stepBindViaRelayComplete() && qrCodeUUIDUrl && (
                            <div
                                className="
                                    brightid-nft-mint-step__description
                                    brightid-nft-mint-step__description--action
                                "
                            >
                                <div className="brightid-nft-mint-step--mobile">
                                    <p className="brightid-nft-mint-step__description-p">
                                        If you're on your mobile device just use
                                        this button to open BrightID and link
                                        your wallet.
                                    </p>
                                    <p className="brightid-nft-mint-step__description-button-container">
                                        <button
                                            className="brightid-nft-mint-step__button"
                                            onClick={() => linkUUIDToBrightID()}
                                        >
                                            Link Address
                                        </button>
                                    </p>
                                    <div className="brightid-nft-mint-step__feedback">
                                        {linkUUIDToBrightIDError && (
                                            <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                                {linkUUIDToBrightIDError}
                                            </div>
                                        )}
                                    </div>
                                    <p className="brightid-nft-mint-step--mobile">
                                        <br />
                                    </p>
                                    <p className="brightid-nft-mint-step__description-p">
                                        If BrightID is installed on another
                                        device scan the QR code below with the
                                        "Scan a Code" button in the BrightID
                                        mobile app.
                                    </p>
                                </div>
                                <div className="brightid-nft-mint-step--desktop">
                                    <p className="brightid-nft-mint-step__description-p">
                                        Use the "Scan a Code" button in the
                                        BrightID app to scan the QR code below.
                                    </p>
                                </div>
                                <p className="brightid-nft-mint-step__description-qrcode-container">
                                    <QRCode
                                        renderAs="svg"
                                        size={200}
                                        value={qrCodeUUIDUrl}
                                    />
                                </p>
                                <div className="brightid-nft-mint-step--desktop">
                                    <p className="brightid-nft-mint-step__description-p">
                                        After linking, you'll get a confirmation
                                        in the BrightID app. Then just wait
                                        about 20-30 seconds and this website
                                        will update to allow continuing to the
                                        next step.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="brightid-nft-mint-step__feedback"></div>
                    </section>
                )}

                {!alreadyHoldsToken && hasModeSelected() && (
                    <section
                        className={`
                        brightid-nft-mint-step
                        brightid-nft-mint-step--${getStepCompleteString(
                            stepRescueViaRelayComplete()
                        )}
                        brightid-nft-mint-step--${getStepActiveString(
                            stepRescueViaRelayComplete() ||
                                stepRescueViaRelayActive()
                        )}
                    `}
                    >
                        <div className="brightid-nft-mint-step__main">
                            <div className="brightid-nft-mint-step__status">
                                <div className="brightid-nft-mint-step__status-icon"></div>
                            </div>
                            <div className="brightid-nft-mint-step__header">
                                <h2 className="brightid-nft-mint-step__heading">
                                    Rescue NFT
                                </h2>
                            </div>
                            <div className="brightid-nft-mint-step__action"></div>
                        </div>

                        {stepConnectWalletComplete() &&
                            stepBindViaRelayComplete() &&
                            stepUUIDLinkedComplete() &&
                            !stepRescueViaRelayComplete() && (
                                <div
                                    className="
                                    brightid-nft-mint-step__description
                                    brightid-nft-mint-step__description--action
                                "
                                >
                                    <p className="brightid-nft-mint-step__description-p">
                                        Enter the wallet address that contains
                                        the NFT you are rescuing.
                                    </p>
                                    <p className="brightid-nft-mint-step__description-button-container">
                                        <input
                                            autoComplete="off"
                                            className="brightid-nft-mint-step__input"
                                            type="text"
                                            onChange={(e) =>
                                                handleRescueAddressChange(e)
                                            }
                                            placeholder="Enter wallet address to rescue from"
                                        />
                                    </p>
                                    <p className="brightid-nft-mint-step__description-button-container">
                                        {hasRelay() && (
                                            <button
                                                className="brightid-nft-mint-step__button"
                                                onClick={() => rescueViaRelay()}
                                                disabled={
                                                    stepRescueViaRelayProcessing ||
                                                    allowBindRetry
                                                        ? true
                                                        : null
                                                }
                                            >
                                                Rescue
                                            </button>
                                        )}
                                        {!hasRelay() && (
                                            <button
                                                className="brightid-nft-mint-step__button"
                                                onClick={() =>
                                                    rescueViaTransaction()
                                                }
                                                disabled={
                                                    stepRescueViaRelayProcessing ||
                                                    allowBindRetry
                                                        ? true
                                                        : null
                                                }
                                            >
                                                Rescue
                                            </button>
                                        )}
                                    </p>
                                </div>
                            )}

                        <div className="brightid-nft-mint-step__feedback">
                            {stepRescueViaRelayStatus && (
                                <div className="brightid-nft-mint-step__response">
                                    <div className="brightid-nft-mint-step__response-loading-icon">
                                        <div className="brightid-nft-mint-step__loading-icon">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="brightid-nft-mint-step__response-message">
                                        <div>{stepRescueViaRelayStatus}</div>
                                    </div>
                                </div>
                            )}
                            {stepRescueViaRelayError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepRescueViaRelayError}
                                </div>
                            )}
                            {isMintedViaContractTxnProcessing && (
                                <div className="brightid-nft-mint-step__response">
                                    <div className="brightid-nft-mint-step__response-loading-icon">
                                        <div className="brightid-nft-mint-step__loading-icon">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="brightid-nft-mint-step__response-message">
                                        <div>
                                            Transaction is being processed...
                                        </div>
                                        <div>
                                            <a
                                                className="brightid-nft-mint-step__response-link"
                                                href={`${mintBlockExplorerUrl}${mintBlockExplorerTxnPath}${isMintedViaContractTxnId}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Transaction
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {stepMintedViaContractError && (
                                <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                    {stepMintedViaContractError}
                                </div>
                            )}
                            {allowBindRetry && (
                                <div className="brightid-nft-mint-step__description">
                                    <p className="brightid-nft-mint-step__description-p">
                                        <strong>
                                            Sorry it looks like your UUID failed
                                            to bind properly. Please use this
                                            retry button to rebind it and then
                                            try minting again.
                                        </strong>
                                    </p>
                                    <p className="brightid-nft-mint-step__description-p">
                                        {hasRelay() &&
                                            stepConnectWalletComplete() && (
                                                <button
                                                    className="brightid-nft-mint-step__button"
                                                    onClick={() =>
                                                        bindViaRelay(true)
                                                    }
                                                    disabled={
                                                        stepBindViaRelayProcessing
                                                            ? true
                                                            : null
                                                    }
                                                >
                                                    Retry Bind
                                                </button>
                                            )}
                                        {!hasRelay() &&
                                            stepConnectWalletComplete() && (
                                                <button
                                                    className="brightid-nft-mint-step__button"
                                                    onClick={() =>
                                                        bindViaTransaction(true)
                                                    }
                                                    disabled={
                                                        stepBindViaRelayProcessing
                                                            ? true
                                                            : null
                                                    }
                                                >
                                                    Retry Bind
                                                </button>
                                            )}
                                    </p>
                                </div>
                            )}
                            {stepRescueViaRelayComplete() && (
                                <div className="brightid-nft-mint-step__description">
                                    <p className="brightid-nft-mint-step__description-p">
                                        <strong>
                                            Your NFT has been rescued.
                                        </strong>
                                    </p>
                                    <p className="brightid-nft-mint-step__description-p">
                                        {walletAddress && (
                                            <a
                                                className="brightid-nft-mint-step__description-link"
                                                href={`https://epor.io/${walletAddress}`}
                                                rel="noreferrer"
                                            >
                                                View Your NFT Here
                                            </a>
                                        )}
                                    </p>

                                    {!hasRelay() &&
                                        hasSwitchedToMintNetwork() && (
                                            <p className="brightid-nft-mint-step__description-p">
                                                Before you leave you can use the
                                                button below to switch your
                                                wallet back to the Ethereum
                                                mainnet.
                                            </p>
                                        )}
                                    {!hasRelay() &&
                                        hasSwitchedToMintNetwork() &&
                                        canAutoSwitchNetworks && (
                                            <p className="brightid-nft-mint-step__description-p">
                                                <button
                                                    className="brightid-nft-mint-step__button"
                                                    onClick={() =>
                                                        switchToMainnetNetwork()
                                                    }
                                                >
                                                    Switch back to Mainnet
                                                </button>
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default BrightIDNftRescue;

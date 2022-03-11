import googlePlay from "./google-play.png";
import appStore from "./app-store.png";
import openAchievementsSS from "./open-achievements-ss.png";
import isVerifiedSS from "./is-verified-ss.png";
import "./BrightIDNftMint.css";
import React, { useState, useEffect, useRef } from "react";
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

    const firstUpdate = useRef(true);

    const [walletAddress, setWalletAddress] = useState("");

    const [ensName, setENSName] = useState("");

    const [chainId, setChainId] = useState("");

    const [gasBalance, setGasBalance] = useState(0.0);

    const [canAutoSwitchNetworks, setCanAutoSwitchNetworks] = useState(false);

    const [isMintedViaContract, setIsMintedViaContract] = useState(false);

    const [stepConnectWalletError, setStepConnectWalletError] = useState("");

    const [stepSwitchToMintNetworkError, setStepSwitchToMintNetworkError] =
        useState("");

    const [stepMintedViaContractError, setStepMintedViaContractError] =
        useState("");

    const [
        isMintedViaContractTxnProcessing,
        setIsMintedViaContractTxnProcessing,
    ] = useState(false);

    const [isMintedViaContractTxnId, setIsMintedViaContractTxnId] =
        useState(null);

    const [stepMintViaContractProcessing, setStepMintViaContractProcessing] =
        useState(false);

    /* Web3 Data Init & Monitoring */
    /* ---------------------------------------------------------------------- */

    async function onAccountDisconnect() {
        resetWalletData();
        setWalletAddress("");
        setENSName("");
        setChainId("");
        setGasBalance("");
        setCanAutoSwitchNetworks("");
        setIsMintedViaContract(false);
    }

    async function onAccountChange() {
        resetWalletData();
        initWalletAddress();
        initENSName();
        initChainId();
        initGasBalance();
        initCanAutoSwitchNetworks();
        initIsMintedViaContract();
    }

    function onChainChanged() {
        initChainId();
    }

    function onChangePolling() {
        if (registration.gasBalance === 0 || registration.gasBalance === 0.0) {
            initGasBalance();
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

    function verifyWithBrightID() {
        window.open(brightIdMeetUrl, "_blank");
    }

    async function initRegistration() {
        if (typeof registration === "object") {
            return;
        }

        console.log("initRegistration");

        // Initialize registration class.
        registration = new BrightIDNftMintModel(
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

        // Reconnect on Load
        reconnectWallet();
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

    async function mintViaTransaction() {
        try {
            setStepMintViaContractProcessing(true);

            const tx = await registration.mintViaTransaction();

            setIsMintedViaContractTxnProcessing(true);
            setIsMintedViaContractTxnId(tx.hash);
            setStepMintedViaContractError("");

            // wait for the transaction to be mined
            await tx.wait();
            // const receipt = await tx.wait();
            // // console.log(receipt);

            await initIsMintedViaContract();

            setStepMintedViaContractError("");
            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepMintViaContractProcessing(false);
        } catch (e) {
            console.error(e);
            // console.log(e);

            await initIsMintedViaContract();

            const errorMessage = registration.getMintErrorMessage(e);
            setStepMintedViaContractError(errorMessage);
            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepMintViaContractProcessing(false);
        }
    }

    /* Step State Checks */
    /* ---------------------------------------------------------------------- */

    function hasConnectedWallet() {
        return walletAddress !== "";
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

    function stepMintViaContractComplete() {
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

    function stepMintViaContractActive() {
        return stepObtainGasTokensComplete() && stepObtainGasTokensActive();
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
                                Install BrightID
                            </h2>
                        </div>
                        <div className="brightid-nft-mint-step__action brightid-nft-mint-step__action--app-store">
                            <div>
                                <a
                                    href={appStoreAndroid}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    <img
                                        className="brightid-nft-mint-step__app-store-image"
                                        src={googlePlay}
                                        alt="Get it on Google Play"
                                    />
                                </a>
                            </div>
                            <div>
                                <a
                                    href={appStoreIos}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    <img
                                        className="brightid-nft-mint-step__app-store-image"
                                        src={appStore}
                                        alt="Download on App Store"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__description">
                        <p className="brightid-nft-mint-step__description-p">
                            The first step is to install the BrightID app on
                            your mobile device.
                        </p>
                    </div>
                </section>

                <section className={`brightid-nft-mint-step`}>
                    <div className="brightid-nft-mint-step__main">
                        <div className="brightid-nft-mint-step__header">
                            <h2 className="brightid-nft-mint-step__heading">
                                Verify with BrightID
                            </h2>
                        </div>
                        {/* <div className="brightid-nft-mint-step__action">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => verifyWithBrightID()}
                            >
                                Get Verified
                            </button>
                        </div> */}
                    </div>
                    <div className="brightid-nft-mint-step__description">
                        <p className="brightid-nft-mint-step__description-p">
                            Once you have BrightID installed you need to become
                            verified in their system by participating in a
                            "Connection Party".
                        </p>
                        <p className="brightid-nft-mint-step__description-button-container">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => verifyWithBrightID()}
                            >
                                Find Connection Party
                            </button>
                        </p>
                        <h3 className="brightid-nft-mint-step__description-p">
                            Support
                        </h3>
                        <p className="brightid-nft-mint-step__description-p">
                            More details on becoming verified within the
                            BrightID system can be found at{" "}
                            <a
                                className="brightid-nft-mint-step__description-link"
                                href="https://brightid.gitbook.io/brightid/getting-verified"
                                target="_blank"
                                rel="noreferrer"
                            >
                                How To Verify
                            </a>
                            .
                        </p>
                        <p className="brightid-nft-mint-step__description-p">
                            They also have a{" "}
                            <a
                                className="brightid-nft-mint-step__description-link"
                                href="https://discord.gg/xzhFEeK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Discord channel
                            </a>{" "}
                            for support.
                        </p>
                        <h3 className="brightid-nft-mint-step__description-p">
                            After Verification
                        </h3>
                        <p className="brightid-nft-mint-step__description-p">
                            After you have verified via a connection party, it
                            will take up to 10 minutes for you to become
                            verified in their system. You will know when you're
                            ready to continue through the rest of steps in this
                            process when you see "BrightID meet" checked off in
                            your list of achievements. See the screenshots below
                            for where to look in the app.
                        </p>

                        <p className="brightid-nft-mint-step__description-p brightid-nft-mint-step__description-p--2col-img">
                            <img
                                className="brightid-nft-mint-step__app-store-image"
                                src={openAchievementsSS}
                                alt="Open Achievements"
                            />
                            <img
                                className="brightid-nft-mint-step__app-store-image"
                                src={isVerifiedSS}
                                alt="Check Is Verified"
                            />
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
                                In your wallet app create a new network with the
                                following data and switch to that network.
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

                <section
                    className={`
                    brightid-nft-mint-step
                    brightid-nft-mint-step--${getStepCompleteString(
                        stepMintViaContractComplete()
                    )}
                    brightid-nft-mint-step--${getStepActiveString(
                        stepMintViaContractComplete() ||
                            stepMintViaContractActive()
                    )}
                `}
                >
                    <div className="brightid-nft-mint-step__main">
                        <div className="brightid-nft-mint-step__status">
                            <div className="brightid-nft-mint-step__status-icon"></div>
                        </div>
                        <div className="brightid-nft-mint-step__header">
                            <h2 className="brightid-nft-mint-step__heading">
                                Mint NFT
                            </h2>
                        </div>
                        <div className="brightid-nft-mint-step__action">
                            {stepConnectWalletComplete() && (
                                <button
                                    className="brightid-nft-mint-step__button"
                                    onClick={() => mintViaTransaction()}
                                    disabled={
                                        stepMintViaContractProcessing
                                            ? true
                                            : null
                                    }
                                >
                                    Mint
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__feedback">
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
                                    <div>Transaction is being processed...</div>
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
                        {stepMintViaContractComplete() && (
                            <div className="brightid-nft-mint-step__description">
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>Your NFT has been rescued.</strong>
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

                                {hasSwitchedToMintNetwork() && (
                                    <p className="brightid-nft-mint-step__description-p">
                                        Before you leave you can use the button
                                        below to switch your wallet back to the
                                        Ethereum mainnet.
                                    </p>
                                )}
                                {hasSwitchedToMintNetwork() &&
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
            </div>
        </div>
    );
}

export default BrightIDNftRescue;

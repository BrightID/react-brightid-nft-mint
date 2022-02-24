import googlePlay from "./google-play.png";
import appStore from "./app-store.png";
import openAchievementsSS from "./open-achievements-ss.png";
import isVerifiedSS from "./is-verified-ss.png";
import "./BrightIDNftMint.css";
import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import BrightIDNftMintModel from "./BrightIDNftMintModel";
import DeepLinker from "./DeepLinker";

let registration;

let changePollingInterval = 0;

function BrightIDNftMint({
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
    mintBlockExplorerUrl = "https://blockscout.com/xdai/mainnet/",
    mintBlockExplorerTxnPath = "/tx/",
    mintRpcUrl = "https://rpc.gnosischain.com/",
    verificationUrl = "https://app.brightid.org/node/v5/verifications",
}) {
    /* State */
    /* ---------------------------------------------------------------------- */

    const firstUpdate = useRef(true);

    const [walletAddress, setWalletAddress] = useState("");

    const [ensName, setENSName] = useState("");

    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const [qrCodeUUIDUrl, setQrCodeUUIDUrl] = useState("");

    const [isBrightIDLinked, setIsBrightIDLinked] = useState(false);

    const [isUUIDLinked, setIsUUIDLinked] = useState(false);

    const [isBoundViaContract, setIsBoundViaContract] = useState(false);

    const [isMintedViaContract, setIsMintedViaContract] = useState(false);

    const [stepConnectWalletError, setStepConnectWalletError] = useState("");

    const [stepBindViaRelayStatus, setStepBindViaRelayStatus] = useState("");

    const [stepBindViaRelayError, setStepBindViaRelayError] = useState("");

    const [stepMintViaRelayStatus, setStepMintViaRelayStatus] = useState("");

    const [stepMintViaRelayError, setStepMintViaRelayError] = useState("");

    const [linkAddressToBrightIDError, setLinkAddressToBrightIDError] =
        useState("");

    const [linkUUIDToBrightIDError, setLinkUUIDToBrightIDError] = useState("");

    // ---

    const [stepBoundViaContractError, setStepBoundViaContractError] =
        useState("");

    const [
        isBoundViaContractTxnProcessing,
        setIsBoundViaContractTxnProcessing,
    ] = useState(false);

    const [isBoundViaContractTxnId, setIsBoundViaContractTxnId] =
        useState(null);

    // ---

    const [stepMintedViaContractError, setStepMintedViaContractError] =
        useState("");

    const [
        isMintedViaContractTxnProcessing,
        setIsMintedViaContractTxnProcessing,
    ] = useState(false);

    const [isMintedViaContractTxnId, setIsMintedViaContractTxnId] =
        useState(null);

    /* Web3 Data Init & Monitoring */
    /* ---------------------------------------------------------------------- */

    async function onAccountDisconnect() {
        resetWalletData();
        setWalletAddress("");
        setENSName("");
        setQrCodeUrl("");
        setQrCodeUUIDUrl("");
        setIsBrightIDLinked("");
        setIsUUIDLinked("");
        setIsBoundViaContract("");
        setIsMintedViaContract("");
    }

    async function onAccountChange() {
        resetWalletData();
        initWalletAddress();
        initENSName();
        initQrCodeUrl();
        initQrCodeUUIDUrl();
        initIsBrightIDLinked();
        initIsUUIDLinked();
        initIsBoundViaContract();
        initIsMintedViaContract();
    }

    function onChangePolling() {
        if (registration.isBrightIDLinked === false) {
            initIsBrightIDLinked();
        }

        if (registration.isUUIDLinked === false) {
            initIsUUIDLinked();
        }

        if (registration.isBoundViaContract === false) {
            initIsBoundViaContract();
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
        }

        if (changePollingInterval) {
            clearInterval(changePollingInterval);
        }
    }

    function addEvents() {
        console.log("add events");

        if (typeof registration.web3Instance === "object") {
            registration.web3Instance.on("accountsChanged", onAccountChange);
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

    async function initQrCodeUrl() {
        try {
            const qrCodeUrl = await registration.getQrCodeUrl();

            setQrCodeUrl(qrCodeUrl);
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

    async function initIsBrightIDLinked() {
        try {
            const isBrightIDLinked = await registration.initIsBrightIDLinked();

            setIsBrightIDLinked(isBrightIDLinked);
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

    async function initIsBoundViaContract() {
        try {
            const isBoundViaContract =
                await registration.initIsBoundViaContract();

            // console.log(isBoundViaContract);

            setIsBoundViaContract(isBoundViaContract);
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

    function linkAddressToBrightID() {
        // window.open(qrCodeUrl);

        var url = qrCodeUrl;

        if (url === "") {
            return;
        }

        var linker = new DeepLinker({
            onIgnored: function () {
                console.log("browser failed to respond to the deep link");

                setLinkAddressToBrightIDError(
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
            context,
            contractAddr,
            mainnetRpcUrl,
            walletConnectInfuraId,
            relayBindURL,
            relayMintURL,
            appStoreAndroid,
            appStoreIos,
            brightIdMeetUrl,
            deepLinkPrefix,
            mintChainId,
            mintChainName,
            mintBlockExplorerUrl,
            mintBlockExplorerTxnPath,
            mintRpcUrl,
            verificationUrl
        );
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

    async function bindViaTransaction() {
        try {
            const tx = await registration.bindViaTransaction();

            setIsBoundViaContractTxnProcessing(true);
            setIsBoundViaContractTxnId(tx.hash);
            setStepBoundViaContractError("");

            // wait for the transaction to be mined
            await tx.wait();
            // const receipt = await tx.wait();
            // // console.log(receipt);

            await initIsBoundViaContract();

            setIsBoundViaContractTxnProcessing(false);
            setIsBoundViaContractTxnId(null);
            setStepBoundViaContractError("");
        } catch (e) {
            // console.error(e);
            // console.log(e);

            setIsBoundViaContractTxnProcessing(false);
            setIsBoundViaContractTxnId(null);
            setStepBoundViaContractError(e.message);
        }
    }

    async function mintViaTransaction() {
        try {
            const tx = await registration.mintViaTransaction();

            setIsMintedViaContractTxnProcessing(true);
            setIsMintedViaContractTxnId(tx.hash);
            setStepMintedViaContractError("");

            // wait for the transaction to be mined
            await tx.wait();
            // const receipt = await tx.wait();
            // // console.log(receipt);

            await initIsMintedViaContract();

            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepMintedViaContractError("");
        } catch (e) {
            // console.error(e);
            // console.log(e);

            setIsMintedViaContractTxnProcessing(false);
            setIsMintedViaContractTxnId(null);
            setStepMintedViaContractError(e.message);
        }
    }

    async function bindViaRelay() {
        try {
            setStepBindViaRelayStatus(
                "We're binding your UUID.  This could take a minute or two. Please wait."
            );

            const response = await registration.bindViaRelay();

            if (response.ok === false) {
                const body = await response.json();

                throw new Error(body.errorMessage);
            }

            await initIsBoundViaContract();

            setStepBindViaRelayError("");
            setStepBindViaRelayStatus("");
        } catch (e) {
            // console.error(e);
            // console.log(e);

            await initIsBoundViaContract();

            setStepBindViaRelayError(e.message);
            setStepBindViaRelayStatus("");
        }
    }

    async function mintViaRelay() {
        try {
            setStepMintViaRelayStatus(
                "We're minting your NFT.  This could take a minute or two. Please wait."
            );

            const response = await registration.mintViaRelay();

            if (response.ok === false) {
                const body = await response.json();

                throw new Error(body.errorMessage);
            }

            await initIsMintedViaContract();

            setStepMintViaRelayError("");
            setStepMintViaRelayStatus("");
        } catch (e) {
            // console.error(e);
            // console.log(e);

            await initIsMintedViaContract();

            setStepMintViaRelayError(e.message);
            setStepMintViaRelayStatus("");
        }
    }

    /* Step State Checks */
    /* ---------------------------------------------------------------------- */

    function hasConnectedWallet() {
        return walletAddress !== "";
    }

    function hasBrightIDLinked() {
        return isBrightIDLinked === true;
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

    /* Step Completion Flags */
    /* ---------------------------------------------------------------------- */

    function getStepCompleteString(status) {
        return status === true ? "complete" : "incomplete";
    }

    function stepConnectWalletComplete() {
        return hasConnectedWallet();
    }

    function stepBrightIDLinkedComplete() {
        return hasBrightIDLinked();
    }

    function stepUUIDLinkedComplete() {
        return hasUUIDLinked();
    }

    function stepBindViaRelayComplete() {
        return hasBoundViaContract();
    }

    function stepMintViaRelayComplete() {
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

    function stepBrightIDLinkedActive() {
        return stepConnectWalletComplete() && stepConnectWalletActive();
    }

    function stepBindViaRelayActive() {
        return stepBrightIDLinkedComplete() && stepBrightIDLinkedActive();
    }

    function stepUUIDLinkedActive() {
        return stepBindViaRelayComplete() && stepBindViaRelayActive();
    }

    function stepMintViaRelayActive() {
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

        // Reconnect on Load
        reconnectWallet();
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
                            "Verification Party".
                        </p>
                        <p className="brightid-nft-mint-step__description-button-container">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => verifyWithBrightID()}
                            >
                                Find Verification Party
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
                        brightid-nft-mint-step--brightid-link
                        brightid-nft-mint-step--${getStepCompleteString(
                            stepBrightIDLinkedComplete()
                        )}
                        brightid-nft-mint-step--${getStepActiveString(
                            stepBrightIDLinkedActive()
                        )}
                    `}
                >
                    <div className="brightid-nft-mint-step__main">
                        <div className="brightid-nft-mint-step__status">
                            <div className="brightid-nft-mint-step__status-icon"></div>
                        </div>
                        <div className="brightid-nft-mint-step__header">
                            <h2 className="brightid-nft-mint-step__heading">
                                Link Wallet to BrightID
                            </h2>
                        </div>
                        {/* <div className="brightid-nft-mint-step__action">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => linkAddressToBrightID()}
                            >
                                Link Address
                            </button>
                        </div> */}
                    </div>
                    {qrCodeUrl && (
                        <div
                            className="
                            brightid-nft-mint-step__description
                            brightid-nft-mint-step__description--action
                        "
                        >
                            <div className="brightid-nft-mint-step--mobile">
                                <p className="brightid-nft-mint-step__description-p">
                                    If you're on your mobile device just use
                                    this button to open BrightID and link your
                                    wallet.
                                </p>
                                <p className="brightid-nft-mint-step__description-button-container">
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => linkAddressToBrightID()}
                                    >
                                        Link Address
                                    </button>
                                </p>
                                <div className="brightid-nft-mint-step__feedback">
                                    {linkAddressToBrightIDError && (
                                        <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                            {linkAddressToBrightIDError}
                                        </div>
                                    )}
                                </div>
                                <p className="brightid-nft-mint-step--mobile">
                                    <br />
                                </p>
                                <p className="brightid-nft-mint-step__description-p">
                                    If BrightID is installed on another device
                                    scan the QR code below with the "Scan a
                                    Code" button in the BrightID mobile app.
                                </p>
                            </div>
                            <div className="brightid-nft-mint-step--desktop">
                                <p className="brightid-nft-mint-step__description-p">
                                    Use the "Scan a Code" button in the BrightID
                                    app to scan the QR code below.
                                </p>
                            </div>
                            {/* <p className="brightid-nft-mint-step__description-qrcode-container">
                                {qrCodeUrl}
                            </p> */}
                            <p className="brightid-nft-mint-step__description-qrcode-container">
                                <QRCode
                                    renderAs="svg"
                                    size={200}
                                    value={qrCodeUrl}
                                />
                            </p>
                            <div className="brightid-nft-mint-step--desktop">
                                <p className="brightid-nft-mint-step__description-p">
                                    After linking, you'll get a confirmation in
                                    the BrightID app. Then just wait a few
                                    seconds and this website will update to
                                    allow continuing to the next step.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="brightid-nft-mint-step__feedback"></div>
                </section>

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
                            {stepConnectWalletComplete() &&
                                stepBrightIDLinkedComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => bindViaRelay()}
                                    >
                                        Bind Via Relay
                                    </button>
                                )}
                            {stepConnectWalletComplete() &&
                                stepBrightIDLinkedComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => bindViaTransaction()}
                                    >
                                        Bind Via Contract
                                    </button>
                                )}
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__description">
                        <p className="brightid-nft-mint-step__description-p">
                            In this step you will be asked to sign a message
                            with your wallet. This will bind the UUID below to
                            you.
                        </p>
                        {registration && registration.uuidHex && (
                            <p className="brightid-nft-mint-step__description-p">
                                <strong>UUID: </strong>
                                <span className="brightid-nft-mint-step__description-wallet-address">
                                    {registration.uuidHex}
                                </span>
                            </p>
                        )}
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
                        {stepBindViaRelayError && (
                            <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                {stepBindViaRelayError}
                            </div>
                        )}
                        {isBoundViaContractTxnProcessing && (
                            <div className="brightid-registration-step__response">
                                <div className="brightid-registration-step__response-loading-icon">
                                    <div className="brightid-registration-step__loading-icon">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="brightid-registration-step__response-message">
                                    <div>Transaction is being processed...</div>
                                    <div>
                                        <a
                                            className="brightid-registration-step__response-link"
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
                            <div className="brightid-registration-step__response brightid-registration-step__response--error">
                                {stepBoundViaContractError}
                            </div>
                        )}
                        {stepBindViaRelayComplete() && (
                            <div className="brightid-nft-mint-step__description">
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>You're UUID has been bound.</strong>
                                </p>
                            </div>
                        )}
                    </div>
                </section>

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
                        {/* <div className="brightid-nft-mint-step__action">
                            <button
                                className="brightid-nft-mint-step__button"
                                onClick={() => linkUUIDToBrightID()}
                            >
                                Link Address
                            </button>
                        </div> */}
                    </div>
                    {qrCodeUUIDUrl && (
                        <div
                            className="
                            brightid-nft-mint-step__description
                            brightid-nft-mint-step__description--action
                        "
                        >
                            <div className="brightid-nft-mint-step--mobile">
                                <p className="brightid-nft-mint-step__description-p">
                                    If you're on your mobile device just use
                                    this button to open BrightID and link your
                                    wallet.
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
                                    If BrightID is installed on another device
                                    scan the QR code below with the "Scan a
                                    Code" button in the BrightID mobile app.
                                </p>
                            </div>
                            <div className="brightid-nft-mint-step--desktop">
                                <p className="brightid-nft-mint-step__description-p">
                                    Use the "Scan a Code" button in the BrightID
                                    app to scan the QR code below.
                                </p>
                            </div>
                            {/* <p className="brightid-nft-mint-step__description-qrcode-container">
                                {qrCodeUUIDUrl}
                            </p> */}
                            <p className="brightid-nft-mint-step__description-qrcode-container">
                                <QRCode
                                    renderAs="svg"
                                    size={200}
                                    value={qrCodeUUIDUrl}
                                />
                            </p>
                            <div className="brightid-nft-mint-step--desktop">
                                <p className="brightid-nft-mint-step__description-p">
                                    After linking, you'll get a confirmation in
                                    the BrightID app. Then just wait a few
                                    seconds and this website will update to
                                    allow continuing to the next step.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="brightid-nft-mint-step__feedback"></div>
                </section>

                <section
                    className={`
                        brightid-nft-mint-step
                        brightid-nft-mint-step--${getStepCompleteString(
                            stepMintViaRelayComplete()
                        )}
                        brightid-nft-mint-step--${getStepActiveString(
                            stepMintViaRelayActive()
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
                            {stepConnectWalletComplete() &&
                                stepBrightIDLinkedComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => mintViaRelay()}
                                    >
                                        Mint Via Relay
                                    </button>
                                )}
                            {stepConnectWalletComplete() &&
                                stepBrightIDLinkedComplete() && (
                                    <button
                                        className="brightid-nft-mint-step__button"
                                        onClick={() => mintViaTransaction()}
                                    >
                                        Mint Via Txn
                                    </button>
                                )}
                        </div>
                    </div>
                    <div className="brightid-nft-mint-step__feedback">
                        {stepMintViaRelayStatus && (
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
                                    <div>{stepMintViaRelayStatus}</div>
                                </div>
                            </div>
                        )}
                        {stepMintViaRelayError && (
                            <div className="brightid-nft-mint-step__response brightid-nft-mint-step__response--error">
                                {stepMintViaRelayError}
                            </div>
                        )}
                        {isMintedViaContractTxnProcessing && (
                            <div className="brightid-registration-step__response">
                                <div className="brightid-registration-step__response-loading-icon">
                                    <div className="brightid-registration-step__loading-icon">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="brightid-registration-step__response-message">
                                    <div>Transaction is being processed...</div>
                                    <div>
                                        <a
                                            className="brightid-registration-step__response-link"
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
                            <div className="brightid-registration-step__response brightid-registration-step__response--error">
                                {stepMintedViaContractError}
                            </div>
                        )}
                        {stepMintViaRelayComplete() && (
                            <div className="brightid-nft-mint-step__description">
                                <p className="brightid-nft-mint-step__description-p">
                                    <strong>You're NFT has been minted.</strong>
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default BrightIDNftMint;

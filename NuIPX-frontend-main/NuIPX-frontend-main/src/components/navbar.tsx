import { useState } from "react";
import { useWallet } from "@meshsdk/react";

import { WALLETS } from "@/constants/wallets";
import { useAppStore } from "@/store/app";
import { useWalletStore } from "@/store/wallet";
import localFont from "next/font/local";
import ConnectBtn from "./modals/connect-btn";

const thunder_regular_font = localFont({
    src: "../../public/fonts/MonumentExtended-Regular.otf",
    variable: "--font-monument-regular",
});

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const { disconnect, connect } = useWallet();
    const { setModal } = useAppStore();

    const { connected_wallet, resetWallet } = useWalletStore();

    const disconnectWallet = () => {
        disconnect();
        resetWallet();
        localStorage.setItem("wallet_name", "")
    }

    return (
        <>
            <div className={`sticky z-[50] top-0 left-0 right-0`}>
                {/* Navbar wrapper */}
                <div className={`p-2 lg:px-5 lg:py-3 w-full sticky`}>
                    <div className={`relative bg-gradient-to-r from-[rgba(255,255,255,0.11)] to-[rgba(255,255,255,0.11)] p-2 lg:p-5 lg:px-8 px-4 rounded-lg md:rounded-2xl`}>
                        <div className="w-full m-auto flex justify-between items-center text-white">
                            <h1 className={"text-3xl uppercase " + thunder_regular_font.className}>NuIPX</h1>
                            <div className="gap-4 flex items-center">
                                {/* Connect Button */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center tracking-wider ">
                                        <ConnectBtn />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;

function Links() {
    return (
        <>
            <a
                href="https://app.nucast.io"
                target={"_blank"}
                rel="noreferrer"
                className="nav-ripple nav-li cursor-pointer"
            >
                Home
            </a>
            <a
                href="https://app.nucast.io/explore"
                target={"_blank"}
                rel="noreferrer"
                className="nav-ripple nav-li cursor-pointer"
            >
                Explore
            </a>
            <a
                href="https://app.nucast.io/store"
                target={"_blank"}
                rel="noreferrer"
                className="cursor-pointer nav-ripple nav-li"
            >
                Store
            </a>
            <a
                className=""
                href="https://mobile.nucast.io"
                target={"_blank"}
            >
                <div className="cursor-pointer nav-ripple nav-li">Mobile</div>
            </a>
            <a
                href="https://app.nucast.io/fest"
                target={"_blank"}
                rel="noreferrer"
                className="nav-ripple nav-li cursor-pointer"
            >
                Fest
            </a>
            <a href="https://nucast.io" target={"_blank"}>
                <div className="cursor-pointer nav-li nav-ripple">About</div>
            </a>
            <a href="mailto:contact@nucast.io">
                <div className="cursor-pointer nav-li nav-ripple">
                    Contact
                </div>
            </a>
        </>
    )
}
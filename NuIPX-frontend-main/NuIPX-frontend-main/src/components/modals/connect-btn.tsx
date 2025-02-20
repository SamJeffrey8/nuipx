import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function ConnectBtn() {
    const { open } = useWeb3Modal()

    const handleConnectWallet = async () => {
        try {
            await open()
        } catch (error) {
            console.error('Failed to connect wallet', error);
        }
    }
    return <button
        onClick={() => handleConnectWallet()}
        className={`border-white border-solid border-2 rounded-lg px-4 font-semibold md:px-[17px] py-2 md:py-[10px] flex items-center gap-x-3 text-base  text-white scale-xs`}
    >
        <div className="capitalize relative">Connect</div>
    </button>
}
import CloseButton from "./close-btn";
import { Loader } from "./loader";
import UploadMedia from "./upload-media";
import UploadDesci from "./upload-desci";
import TokenInfoMedia from "./token-info-media";
import TokenInfoDesci from "./token-info-desci";

import { useAppStore } from "@/store/app";

const Modals = {
    LOADING: Loader,
    UPLOAD_MEDIA: UploadMedia,
    UPLOAD_DESCI: UploadDesci,
    TOKEN_INFO_MEDIA: TokenInfoMedia,
    TOKEN_INFO_DESCI: TokenInfoDesci
}

const Modal = () => {

    const { modal: { state } } = useAppStore();

    if (state) {

        const Child = Modals[state];

        return (
            <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-lg bg-black/40 z-[50] p-6">
                <div className="flex justify-start md:justify-center items-center h-full w-full flex-col gap-4">
                    <CloseButton />
                    <Child />
                </div>
            </div>
        );
    }

};

export default Modal;
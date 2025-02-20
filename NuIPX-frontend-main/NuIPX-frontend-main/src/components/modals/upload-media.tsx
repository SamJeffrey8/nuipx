import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useAppStore } from "@/store/app";
import { Loader } from "../loader";
import Image from "next/image";
import { toast } from "react-toastify";

const Upload = () => {
  const { setMediaFile, setModal } = useAppStore();
  const [isFile, setIsFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ODYwZTIwYS00ZmE0LTQ0OTgtYmUzYS04NDM3ZTZmYTQ2Y2QiLCJlbWFpbCI6ImxsY2FkYXhvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzA1NzIyNWViNTU2MmFlMTQzNDEiLCJzY29wZWRLZXlTZWNyZXQiOiJiY2ZmYzljM2NiNjhhZDFhMTZjNDlhMTY3ZGY3MWQxNTFjNTI2YjIwOGJhMjU0OWY1Yzc2OTQ1ZTk3MGM3OWYxIiwiaWF0IjoxNzA2MTA3NjExfQ.tF5o3m_3TU-4Jwc80_sCFitjcXtdVfzr-CrNNSpPtpQ";



  const uploadToIPFS = async (
    file: File
  ) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<{ IpfsHash: string }>(
        "/api/upload", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper file upload
          }
        }
      );
      setLoading(false);
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS", error);
      setLoading(false);
      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const pinataMetadata = JSON.stringify({
          name: file.name,
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
          cidVersion: 0,
        });
        formData.append("pinataOptions", pinataOptions);
        // const response = await axios.post<{ IpfsHash: string }>(
        //   "https://api.pinata.cloud/pinning/pinFileToIPFS",
        //   formData,
        //   {
        //     maxBodyLength: Infinity,
        //     headers: {
        //       "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
        //       Authorization: `Bearer ${JWT}`,
        //       pinata_api_key: "7057225eb5562ae14341",
        //       pinata_secret_api_key:
        //         "bcffc9c3cb68ad1a16c49a167df71d151c526b208ba2549f5c76945e970c79f1",
        //     },
        //   }
        // );
        // Dummy value for testing
        const ipfsHash = "QmZsF9W41HDGTjwDvuFyMkVzQ6cmVCUViUQkTsQJoCkWgR";
        // const ipfsHash = await uploadToIPFS(selectedFile);
        // console.log(response.data)
        setMediaFile(file.type, "ipfs://" + (ipfsHash ?? ""));
        setIsFile(true);
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }
  };

  useEffect(() => {
    if (isFile) {
      setModal("TOKEN_INFO_MEDIA");
    }
  }, [isFile]);

  return (
    <div className="bg-[#4040406e] text-white relative flex h-[70vh] w-full max-w-[700px] flex-col gap-2 rounded-md p-5 md:h-[80vh]">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md">
          <div
            className="border border-white border-dashed rounded-lg relative flex h-36 w-36 cursor-pointer items-center justify-center hover:bg-primary/20"
            onClick={handleUpload}
          >
            <Image className="absolute" width={40} height={40} loader={({ src }) => src} src="https://cdn-icons-png.flaticon.com/512/8202/8202904.png" alt="Drag And Drop" />
            <input
              type="file"
              ref={fileInputRef}
              className=" invisible"
              onChange={handleFileChange}
            />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-xl font-bold">Drag & Drop</h1>
            <span className="mt-1 text-lg">Your file here or browse</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;

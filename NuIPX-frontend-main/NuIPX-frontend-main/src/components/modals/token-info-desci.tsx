import { type ChangeEvent, useState } from "react";
import Button from "../button";
import { useAppStore } from "@/store/app";
import { error } from "@/utils";
import axios from "axios";
import { type InputProps } from "@/types";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { Comfortaa } from "next/font/google";

const comfortaa_font = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  weight: ["400", "500", "600", "700"],
});

type Fields =
  "name" |
  "description" |
  "isCommercialUseAllowed" |
  "royaltyPercentage" |
  "isLicenseTransferrable" |
  "derivativeResearchAllowed" |
  "peerReviewRequired" |
  "DAOgovernanceRequired" |
  "KYCRequired" |
  "legalContractURL" |
  "creatorAddress" |
  "reviewers" |
  "derivativeResearchAddress" |
  "newInstitutionAddress" |
  "contributors" |
  "contributionAmount" |
  "useCase" |
  "dataEndpoint" |
  "perDataCost";


const TokenInfo = () => {
  const { address } = useAccount();
  const { mediaFile, setModal } = useAppStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isCommercialUseAllowed: false,
    royaltyPercentage: "",
    isLicenseTransferrable: false,
    derivativeResearchAllowed: false,
    peerReviewRequired: false,
    DAOgovernanceRequired: false,
    KYCRequired: false,
    legalContractURL: "",
    creatorAddress: "",
    reviewers: "",
    derivativeResearchAddress: "",
    newInstitutionAddress: "",
    contributors: "",
    contributionAmount: "",
    useCase: "",
    dataEndpoint: "",
    perDataCost: ""
  });

  type FieldName = keyof typeof formData;

  const handleInputChange = (fieldName: FieldName, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  type SetterFunction = (
    updateFunction: (prevState: string[]) => string[],
  ) => void;
  const handleCheckboxChange = (
    setter: SetterFunction,
    value: string,
  ): void => {
    setter((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value],
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const metadata = {
        name: formData.name,
        description: formData.description,
        parameters: {
          isCommercialUseAllowed: formData.isCommercialUseAllowed,
          royaltyPercentage: formData.royaltyPercentage,
          isLicenseTransferrable: formData.isLicenseTransferrable,
          derivativeResearchAllowed: formData.derivativeResearchAllowed,
          peerReviewRequired: formData.peerReviewRequired,
          DAOgovernanceRequired: formData.DAOgovernanceRequired,
          KYCRequired: formData.KYCRequired
        },
        legalContractURL: formData.legalContractURL,
        smartContractFunctions: {
          mintDeSciIP: {
            creator: formData.creatorAddress,
            royaltyPercentage: formData.royaltyPercentage,
            peerReviewRequired: formData.peerReviewRequired
          },
          assignPeerReviewers: {
            reviewers: formData.reviewers.split(",").map(el => el.trim())
          },
          verifyDerivativeResearch: {
            derivativeResearch: formData.derivativeResearchAddress
          },
          transferLicense: {
            newInstitution: formData.newInstitutionAddress
          },
          royaltyDistribution: {
            contributors: formData.contributors.split(",").map(el => el.trim()),
            amount: formData.royaltyPercentage
          }
        },
        useCases: formData.useCase,
        data_endpoint: formData.dataEndpoint,
        per_data_cost: formData.perDataCost
      }
      console.log(JSON.stringify(metadata));

      // const { data } = await axios.post("/api/mintTo", {
      //   contractAddress: process.env.CONTRACT_ADDRESS,
      //   toWalletAddress: address,
      //   metadata,
      // });
      console.log(metadata);
      // toast.success("Token minted to your wallet: " + "data.transactionHash");
      // setLoading(false);
      // setModal(null)
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed !");
      setLoading(false);
    }
  };
  return (
    <div
      className={comfortaa_font.className + " no-scrollbar bg-[#0F0F0F] text-white relative flex h-[70vh] w-full max-w-[700px] flex-col gap-2 overflow-auto rounded-xl p-5 md:h-[80vh]"}
      data-lenis-prevent
    >
      <div className="mb-2 w-full text-center text-2xl font-bold">
        {preview ? "Token Preview (DeSci)" : "Token Info (DeSci)"}
      </div>
      <div className="flex flex-col gap-3">
        <TitleAndInput
          value={formData.name}
          title="Name"
          inputPlaceholder="Enter name"
          onChange={(value) => handleInputChange("name", value)}
        />
        <TitleAndInput
          textArea
          value={formData.description}
          title="Description"
          inputPlaceholder="Enter description"
          onChange={(value) => handleInputChange("description", value)}
        />

        <TitleAndInput
          value={formData.royaltyPercentage}
          title="Royalty Percentage"
          inputPlaceholder="Enter percentage"
          onChange={(value) => handleInputChange("royaltyPercentage", value)}
        />
        <TitleAndInput
          value={formData.legalContractURL}
          title="Legal Contract URL"
          inputPlaceholder="Enter URL"
          onChange={(value) => handleInputChange("legalContractURL", value)}
        />
        <TitleAndInput
          value={formData.creatorAddress}
          title="Creator Address"
          inputPlaceholder="Enter Address"
          onChange={(value) => handleInputChange("creatorAddress", value)}
        />
        <TitleAndInput
          value={formData.reviewers}
          title="Assign Peer Reviewers (Comma Seaparated)"
          inputPlaceholder="Enter Reviewers"
          onChange={(value) => handleInputChange("reviewers", value)}
        />
        <TitleAndInput
          value={formData.derivativeResearchAddress}
          title="Verify Derivative Research"
          inputPlaceholder="Derivative Research Address"
          onChange={(value) => handleInputChange("derivativeResearchAddress", value)}
        />
        <TitleAndInput
          value={formData.newInstitutionAddress}
          title="Transfer Licence"
          inputPlaceholder="New Institution Address"
          onChange={(value) => handleInputChange("newInstitutionAddress", value)}
        />
        <TitleAndInput
          value={formData.contributors}
          title="Contributors (Comma separated)"
          inputPlaceholder="Enter Contributor Addresses"
          onChange={(value) => handleInputChange("contributors", value)}
        />
        <TitleAndInput
          value={formData.useCase}
          title="Use Case"
          inputPlaceholder="Enter Use Case"
          onChange={(value) => handleInputChange("useCase", value)}
        />
        <TitleAndInput
          value={formData.useCase}
          title="Data Endpoint"
          inputPlaceholder="Enter Data Endpoint"
          onChange={(value) => handleInputChange("dataEndpoint", value)}
        />
        <TitleAndInput
          value={formData.useCase}
          title="Per Data Cost"
          inputPlaceholder="Enter Per Data Cost"
          onChange={(value) => handleInputChange("perDataCost", value)}
        />
        <CheckboxGroup title="Permissions" options={[
          { label: "Commercial Use Allowed", field: "isCommercialUseAllowed" },
          { label: "License Transferrable", field: "isLicenseTransferrable" },
          { label: "Derivative Research Allowed", field: "derivativeResearchAllowed" },
          { label: "Peer Review Required", field: "peerReviewRequired" },
          { label: "DAO Governance Required", field: "DAOgovernanceRequired" },
          { label: "KYC Required", field: "KYCRequired" },
        ]} formData={formData} handleInputChange={handleInputChange} />

      </div>
      <div className="mt-6 flex w-full items-center justify-between border-t pt-8 ">
        <Button
          className="group relative flex items-center justify-center gap-4 px-6 "
          onClick={() => {
            preview ? setPreview(false) : setModal("UPLOAD_DESCI");
          }}
        >
          <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
            BACK
          </div>
        </Button>
        {!preview ? (
          <Button
            className="group relative flex items-center justify-center gap-4 px-6 "
            onClick={() => setPreview(true)}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              NEXT
            </div>
          </Button>
        ) : (
          <Button
            className="group relative flex items-center justify-center gap-4 px-4 md:px-10 "
            onClick={handleSubmit}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              {loading ? "Loading..." : "Mint Now"}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TokenInfo;

function TitleAndInput({
  title,
  inputPlaceholder,
  textArea,
  value,
  onChange,
  preview,
}: InputProps) {
  const [inpVal, setInpVal] = useState<string>(value ?? "");

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInpVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 font-inter tracking-wide">
      <h2 className="ml-1 font-semibold text-secondary">{title ?? "Lorem"}</h2>

      <div className="relative mt-2 font-medium">
        {textArea ? (
          <textarea
            className={`bg-[#121212] text-white font-ibm-mono w-full resize-none overflow-hidden rounded-lg bg-primary/20 py-3 pl-5 pr-8 text-sm outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder}
            value={inpVal ?? ""}
            rows={4}
            onChange={handleOnChange}
            readOnly={preview}
          />
        ) : (
          <input
            type="text"
            className={`bg-[#121212] text-white font-ibm-mono w-full rounded-lg bg-primary/20 px-5 py-3 pr-10 text-sm outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder ?? "Lorem ipsum dolor sit amet"}
            value={inpVal ?? ""}
            onChange={handleOnChange}
            readOnly={preview}
            name={title?.toLowerCase()}
          />
        )}
      </div>
    </div>
  );
}

function CheckboxGroup({ title, options, formData, handleInputChange }:
  { title: string, options: { field: Fields, label: string }[], formData: any, handleInputChange: (fieldName: Fields, value: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="ml-1 font-semibold text-secondary">{title}</h2>
      {options.map((option) => (
        <label key={option.field} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData[option.field]}
            onChange={(e) => handleInputChange(option.field as Fields, e.target.checked as unknown as string)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
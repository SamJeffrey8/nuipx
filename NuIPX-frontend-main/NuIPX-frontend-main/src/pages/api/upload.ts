import axios from "axios";
import FormData from "form-data";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ODYwZTIwYS00ZmE0LTQ0OTgtYmUzYS04NDM3ZTZmYTQ2Y2QiLCJlbWFpbCI6ImxsY2FkYXhvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzA1NzIyNWViNTU2MmFlMTQzNDEiLCJzY29wZWRLZXlTZWNyZXQiOiJiY2ZmYzljM2NiNjhhZDFhMTZjNDlhMTY3ZGY3MWQxNTFjNTI2YjIwOGJhMjU0OWY1Yzc2OTQ1ZTk3MGM3OWYxIiwiaWF0IjoxNzA2MTA3NjExfQ.tF5o3m_3TU-4Jwc80_sCFitjcXtdVfzr-CrNNSpPtpQ";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file = files.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: file.originalFilename,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
            pinata_api_key: "7057225eb5562ae14341",
            pinata_secret_api_key:
              "bcffc9c3cb68ad1a16c49a167df71d151c526b208ba2549f5c76945e970c79f1",
          },
        }
      );

      return res.status(200).json({ IpfsHash: response.data?.IpfsHash });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
  });
}

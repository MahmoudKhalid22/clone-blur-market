import express from "express";
import Moralis from "moralis";
// import { ParsedQs } from "qs";

const app = express();

app.get("/getnftdata", async (req, res) => {
  try {
    const { query } = req;

    if (typeof query.contractAddress === "string") {
      const response = await Moralis.EvmApi.nft.getNFTTrades({
        address: query.contractAddress as string, // Ensure it is a string
        chain: "0x1",
      });

      return res.status(200).json(response);
    } else if (Array.isArray(query.contractAddress)) {
      const nftData: any[] = [];
      const contractAddresses = query.contractAddress as string[]; // Ensure it is an array of strings

      for (let i = 0; i < contractAddresses.length; i++) {
        const response = await Moralis.EvmApi.nft.getNFTTrades({
          address: contractAddresses[i],
          chain: "0x1",
        });

        nftData.push(response);
      }

      const response = { nftData };
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ error: "Invalid contractAddress" });
    }
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json({ error: "An error occurred" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

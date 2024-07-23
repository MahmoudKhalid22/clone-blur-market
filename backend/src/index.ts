import express from "express";
import Moralis from "moralis";
// import { ParsedQs } from "qs";

const app = express();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

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

app.get("/getcontractnft", async (req, res) => {
  try {
    const { query } = req;
    const chain = query.chain == "0x5" ? "0x5" : "0x1";

    const response = await Moralis.EvmApi.nft.getContractNFTs({
      chain,
      format: "decimal",
      address: query?.contractAddress as string,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong ${e}`);
    return res.status(400).json();
  }
});

app.get("/getnfts", async (req, res) => {
  try {
    const { query } = req;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: query?.address as string,
      chain: query.chain as string,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong ${e}`);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(3000, () => {
    console.log(`Listening for API calls`);
  });
});

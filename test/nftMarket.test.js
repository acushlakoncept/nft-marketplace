
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  const _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  })

  describe("Mint NFT", () => {
    const tokenURI = "https://example.com/token/1";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice
      });
    })

    it("owner of first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert(owner == accounts[0], "Owner of token is not matching address[0]");
    })

    it("first token should point to tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      assert(actualTokenURI == tokenURI, "TokenURI is not matching");
    })

    it("should not be possible to create NFT with already used tokenURI", async () => {

      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0]
        })
      } catch (error) {
        assert(error, "Token URI already exists");
      }

    })

    it("should have one listed item", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert(listedItemsCount == 1, "Listed item count is not 1");
    })

    it("should have created Nft item", async () => {
      const nftItem = await _contract.getNftItem(1);
      console.log(nftItem)
      assert(nftItem.tokenId == 1, "Token id is not 1");
      assert(nftItem.price == _nftPrice, `Token price is not ${_nftPrice}`);
      assert(nftItem.creator == accounts[0], `Nft creator does not match ${accounts[0]}`);
      assert(nftItem.isListed == true, "Token is not listed");
    })

  })

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice
      })
    })

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    })

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented!");
    })

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Owner not changed!");
    })
  })
})

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


  describe("Token transfers", () => {
    const tokenURI = "https://test-json.com"
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice
      });
    })

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(totalSupply.toNumber(), 2, "Total supply is not 2");
    })

    it("should be able to retrieve token by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);

      assert.equal(nftId1.toNumber(), 1, "NFT id is not 1");
      assert.equal(nftId2.toNumber(), 2, "NFT id is not 2");
    })

    it("should have one listed NFT", async () => {
      const allNftsOnSale = await _contract.getAllNftsOnSale();
      assert.equal(allNftsOnSale[0].tokenId, 2, "Nft has wrong id");
    })

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1]});
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has wrong id");
    })

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0]});
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has wrong id");
    })

  })

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(
        accounts[0], 
        accounts[1], 
        2
      );
    })

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
      assert.equal(ownedNfts.length, 0, "Invalid length of tokens")
    })

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
      assert.equal(ownedNfts.length, 2, "Invalid length of tokens")

    })
  })

  describe("List NFT", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice
      })
    })

    it("should have two listed NFTs", async () => {
      const listedItem = await _contract.getAllNftsOnSale();
      assert.equal(listedItem.length, 2, "Invalid of of listed NFTs");
    })

    it("should set new listing price", async () => {
      await _contract.setListingPrice(_listingPrice);
      const listingPrice = await _contract.listingPrice();
      assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
    })
  })



  // describe("Burn Token", () => {
  //   const tokenURI = "https://test-json3.com"
  //   before(async () => {
  //     await _contract.mintToken(tokenURI, _nftPrice, {
  //       from: accounts[2],
  //       value: _listingPrice
  //     });
  //   })

  //   it("account[2] should have one owned NFT", async () => {
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2]});
  //     assert.equal(ownedNfts[0].tokenId, 3, "Nft has wrong id");
  //   })

  //   it("account[2] should owned 0 NFTs", async () => {
  //     await _contract.burnToken(3, {from: accounts[2]});
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2]});
  //     assert.equal(ownedNfts.length, 0, "Invalid length of NFTs");
  //   })

  // })


})
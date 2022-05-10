
const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", accounts => {
  let _contract = null;

  before(async () => {
    _contract = await NftMarket.deployed();
  })

  describe("Mint token", () => {
    const tokenURI = "https://example.com/token/1";

    before(async () => {
      await _contract.mintToken(tokenURI, {
        from: accounts[0]
      });
    })

    it("owner of first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert(owner == accounts[0], "Owner of token is not matching address[0]");
    })
  })
})
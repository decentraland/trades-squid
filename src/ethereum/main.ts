import * as ethereumMarketplaceAbi from '../abi/DecentralandMarketplaceEthereum'
import { getDb } from '../common/db'
import { getDataHandler } from '../common/handler'
import { createOffchainMarketplaceProcessor } from '../common/processor'
import { decentralandMarketplaceAddress } from '../common/utils/addresses'
import { Network } from '../model'

const ethereumMarketplaceAddress = decentralandMarketplaceAddress[Network.ethereum][process.env.ETHEREUM_CHAIN_ID]

const processor = createOffchainMarketplaceProcessor({
  address: ethereumMarketplaceAddress,
  fromBlock: 6177117,
  gateway: process.env.ETHEREUM_GATEWAY,
  rpcEndpoint: process.env.ETHEREUM_RPC_ENDPOINT,
  abi: ethereumMarketplaceAbi
})

processor.run(getDb(Network.ethereum), getDataHandler(ethereumMarketplaceAbi, ethereumMarketplaceAddress, Network.ethereum))

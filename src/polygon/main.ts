import * as polygonMarketplaceAbi from '../abi/DecentralandMarketplacePolygon'
import { getDb } from '../common/db'
import { getDataHandler } from '../common/handler'
import { createOffchainMarketplaceProcessor } from '../common/processor'
import { decentralandMarketplaceAddress } from '../common/utils/addresses'
import { Network } from '../model'

const polygonMarketplaceAddress = decentralandMarketplaceAddress[Network.polygon][process.env.POLYGON_CHAIN_ID]

const processor = createOffchainMarketplaceProcessor({
  address: polygonMarketplaceAddress,
  fromBlock: 8947920,
  gateway: process.env.POLYGON_GATEWAY,
  rpcEndpoint: process.env.POLYGON_RPC_ENDPOINT,
  abi: polygonMarketplaceAbi
})

processor.run(getDb(Network.polygon), getDataHandler(polygonMarketplaceAbi, polygonMarketplaceAddress, Network.polygon))

import { ChainId } from '@dcl/schemas'
import { Network } from '../../model'

export const decentralandMarketplaceAddress = {
  [Network.ethereum]: {
    [ChainId.ETHEREUM_SEPOLIA]: '0xb901e30251CDb9CFaD2dDD4FDb4798D5B4312C69'
  },
  [Network.polygon]: {
    [ChainId.MATIC_AMOY]: '0xaF31A4620B95175C0F5ad6e968D77E7D1d3dd2A9'
  }
}

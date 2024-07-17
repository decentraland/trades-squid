import { ChainId } from '@dcl/schemas'
import { Network } from '../../model'

export type ProcessorConfig = { marketplaceAddress: string; fromBlock: number; gatewayNetwork: string }

export const processorConfig: Record<Network, Partial<Record<ChainId, ProcessorConfig>>> = {
  [Network.ethereum]: {
    [ChainId.ETHEREUM_MAINNET]: {
      marketplaceAddress: '', // @TODO: Add marketplace address for mainnet once contract is deployed
      fromBlock: 0, // @TODO: Add starting block for mainnet once contract is deployed
      gatewayNetwork: 'ethereum-mainnet'
    },
    [ChainId.ETHEREUM_SEPOLIA]: {
      marketplaceAddress: '0xb901e30251CDb9CFaD2dDD4FDb4798D5B4312C69',
      fromBlock: 0,
      gatewayNetwork: 'ethereum-sepolia'
    }
  },
  [Network.polygon]: {
    [ChainId.MATIC_MAINNET]: {
      marketplaceAddress: '', // @TODO: Add marketplace address for mainnet once contract is deployed
      fromBlock: 0, // @TODO: Add starting block for mainnet once contract is deployed
      gatewayNetwork: 'polygon-mainnet'
    },
    [ChainId.MATIC_AMOY]: {
      marketplaceAddress: '0xaF31A4620B95175C0F5ad6e968D77E7D1d3dd2A9',
      fromBlock: 0,
      gatewayNetwork: 'polygon-amoy-testnet'
    }
  }
}

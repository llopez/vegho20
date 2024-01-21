import { InjectionKey, provide, onBeforeMount, ref, watch } from 'vue';
import { RawPool, SubgraphPoolProvider } from '@balancer/sdk';
import { safeInject } from './inject';
import { useNetwork } from './network';
import { BalancerSubgraph, PoolType } from '../utils/BalancerSubgraph';

export const poolsProvider = () => {
  const { network } = useNetwork();

  const pools = ref<PoolType[] | RawPool[]>([]);
  const isLoading = ref(true);

  watch(network, async () => {
    await initPools();
  });

  async function initPools() {
    if (!network.value) return;
    isLoading.value = true;
    console.log('init pools for network', network.value.id);

    if (network.value.id === 11155111) {
      const sepoliaPoolProvider = new BalancerSubgraph(
        'https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest'
      );
      const _pools = await sepoliaPoolProvider.getPools();
      pools.value = _pools;
    } else {
      const poolProvider = new SubgraphPoolProvider(
        network.value.id,
        undefined,
        {
          gqlAdditionalPoolQueryFields: 'name symbol totalLiquidity',
        }
      );

      const timestamp = BigInt(Math.floor(new Date().getTime() / 1000));

      const { pools: _pools } = await poolProvider.getPools({ timestamp });

      pools.value = _pools;
    }
    // pools.value = _pools.sort((a, b) => {
    //   // @ts-ignore
    //   return parseFloat(b.totalLiquidity) - parseFloat(a.totalLiquidity);
    // });

    isLoading.value = false;
  }

  onBeforeMount(async () => {
    await initPools();
  });

  function getPoolByID(id: string) {
    return pools.value.find(pool => pool.id === id);
  }

  return {
    pools,
    getPoolByID,
    isLoading,
  };
};

export type PoolsResponse = ReturnType<typeof poolsProvider>;

export const PoolsProviderSymbol: InjectionKey<PoolsResponse> =
  Symbol('providers.pools');

export function providePools(): PoolsResponse {
  const pools = poolsProvider();
  provide(PoolsProviderSymbol, pools);
  return pools;
}

export function usePools(): PoolsResponse {
  return safeInject(PoolsProviderSymbol);
}

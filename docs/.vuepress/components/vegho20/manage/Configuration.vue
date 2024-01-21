<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useVeSystem } from '../../../providers/veSystem';
import { CONFIG } from '../../../constants/config';
import { secondsToDate } from '../../../utils';
import UnlockAllModal from './UnlockAllModal.vue';
import EarlyUnlockModal from './EarlyUnlockModal.vue';
import EarlyPenaltyModal from './EarlyPenaltyModal.vue';
import { useWeb3ModalProvider } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { useController } from '../../../utils/VotingEscrowController';
import { ethers } from 'ethers';
import { Select, SelectTrigger, SelectOptions } from '../../Select';
import Tooltip from '../Tooltip.vue';

import { usePools } from '../../../providers/pools';

const { pools, isLoading: isLoadingPools } = usePools();
const { walletProvider } = useWeb3ModalProvider();
const { network } = useNetwork();
const {
  selected: veSystem,
  data: veSystems,
  select: selectVeSystem,
} = useVeSystem();
const {
  allUnlock,
  setAllUnlock,
  earlyUnlock,
  setEarlyUnlock,
  getEarlyUnlockPenalty,
  setEarlyUnlockPenalty,
} = useController({
  walletProvider,
  network,
  veSystem,
});

const allUnlockStatus = ref<boolean>(false);
const earlyUnlockStatus = ref<boolean>(false);
const earlyPenalty = ref<number>(0);

const isLoadingAllUnlock = ref<boolean>(false);
const isEarlyPenaltyModalOpen = ref<boolean>(false);
const isUnlockAllModalOpen = ref<boolean>(false);
const isEarlyUnlockModalOpen = ref<boolean>(false);
const isLoadingEarlyUnlock = ref<boolean>(false);
const isLoadingEarlyPenalty = ref<boolean>(false);

watch(veSystem, async () => {
  await fetchEarlyPenalty();
  await fetchUnlockStatus();
  await fetchEarlyUnlockStatus();
});

const fetchEarlyPenalty = async () => {
  const result = await getEarlyUnlockPenalty.value?.();
  earlyPenalty.value = result ? ethers.toNumber(result) : 0;
};

const fetchUnlockStatus = async () => {
  const allUnlockResult = await allUnlock.value?.();

  allUnlockStatus.value = allUnlockResult ?? false;
};

const fetchEarlyUnlockStatus = async () => {
  const result = await earlyUnlock.value?.();

  earlyUnlockStatus.value = result ?? false;
};

const handleUnlockModalClose = () => {
  isUnlockAllModalOpen.value = false;
};

const handleUnlockModalOpen = () => {
  isUnlockAllModalOpen.value = true;
};

const handleEarlyUnlockModalClose = () => {
  isEarlyUnlockModalOpen.value = false;
};

const handleEarlyUnlockModalOpen = () => {
  isEarlyUnlockModalOpen.value = true;
};

const handleEarlyPenaltyModalClose = () => {
  isEarlyPenaltyModalOpen.value = false;
};

const handleEarlyPenaltyModalOpen = () => {
  isEarlyPenaltyModalOpen.value = true;
};

const handleEarlyUnlock = async () => {
  await setEarlyUnlock.value?.(!earlyUnlockStatus.value, {
    onPrompt: () => {
      console.log('onPrompt');
      isEarlyUnlockModalOpen.value = false;
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isLoadingEarlyUnlock.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingEarlyUnlock.value = false;
      fetchEarlyUnlockStatus();
    },
    onError: err => {
      console.log('err', err);
      isLoadingEarlyUnlock.value = false;
    },
  });
};

const handleUnlock = async () => {
  await setAllUnlock.value?.({
    onPrompt: () => {
      console.log('onPrompt');
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isUnlockAllModalOpen.value = false;
      isLoadingAllUnlock.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingAllUnlock.value = false;
      fetchUnlockStatus();
    },
    onError: err => {
      console.log('err', err);
      isLoadingAllUnlock.value = false;
    },
  });
};

const handleSetEarlyPenalty = async (penalty: number) => {
  console.log('set penalty', penalty);

  await setEarlyUnlockPenalty.value?.(ethers.toBigInt(penalty), {
    onPrompt: () => {
      console.log('onPrompt');
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isEarlyPenaltyModalOpen.value = false;
      isLoadingEarlyPenalty.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingEarlyPenalty.value = false;
      fetchEarlyPenalty();
    },
    onError: err => {
      console.log('err', err);
      isLoadingEarlyPenalty.value = false;
    },
  });
};

const formFields = computed(() => {
  const startTime = veSystem.value
    ? secondsToDate(
        parseInt(veSystem.value.rewardDistributor.rewardStartTime.toString())
      ).toLocaleDateString()
    : '';

  const supplyVested = veSystem.value
    ? parseFloat(veSystem.value.votingEscrow.supplyVestedPercent) * 100
    : 0;

  return [
    {
      label: 'Underlying ve8020GHO BPT address',
      name: 'bptAddress',
      value: veSystem.value?.bptToken,
    },
    {
      label: 'veToken Name',
      name: 'veTokenName',
      value: veSystem.value?.votingEscrow.name,
    },
    {
      label: 'veToken Symbol',
      name: 'veTokenSymbol',
      value: veSystem.value?.votingEscrow.symbol,
    },
    {
      label: 'veGHO20 Factory',
      name: 'factoryUsed',
      value: network.value
        ? CONFIG.get(network.value.id)?.LAUNCHPAD_CONTRACT
        : '',
    },
    {
      label: 'Rewards Distribution Address',
      name: 'rewardsAddress',
      value: veSystem.value?.rewardDistributorAddress,
    },
    {
      label: 'Distribution Start-time',
      type: 'date',
      name: 'distribution',
      value: startTime,
    },
    {
      label: '% of BPT supply locked',
      name: 'supplyVested',
      value: supplyVested.toString().concat('%'),
    },
    {
      label: 'Rewards Distribution Admin',
      name: 'rewardsDistribution',
      value: veSystem.value?.admin,
    },
  ];
});

watch(pools, value => {
  filteredPools.value = value;
});

const filteredPools = ref();

const selectedPool = ref({});

const searchTokens = text => {
  filteredPools.value = pools.value.filter(
    x =>
      x.symbol.toLowerCase().includes(text.toLowerCase()) ||
      x.address.toLowerCase() === text.toLowerCase()
  );
};
const onTokenInChange = value => {
  console.log(value);
  selectedPool.value = value;
  // bptAddress.value = value.address;
  const _veSystem = veSystems.value.find(x => x.bptToken === value);

  if (!_veSystem) return;

  selectVeSystem(_veSystem.id);
};
</script>

<template>
  <main class="section-container">
    <section class="section-body">
      <div key="pool-selector" class="item-row">
        <p class="item-name">Select ve8020GHO BPT address</p>
        <div class="input-group custom-group">
          <Select :onChange="onTokenInChange" :value="selectedPool">
            <SelectTrigger
              :value="selectedPool.address"
              placeholder="Select Pool"
            >
              <Avatar
                :address="selectedPool.address"
                :imageURL="selectedPool.logoURI"
                :size="20"
              />
              <span>{{ selectedPool.symbol }}</span>
            </SelectTrigger>
            <SelectOptions
              v-slot="pool"
              :options="filteredPools"
              optionKey="address"
              :searchFn="searchTokens"
            >
              <Avatar
                :address="pool.address"
                :imageURL="pool.logoURI"
                :size="20"
              />
              <span>{{ pool.symbol }}</span>
            </SelectOptions>
          </Select>
        </div>
      </div>
      <div key="selected-ve-system" class="item-row">
        <p class="item-name">veSystem</p>
        <div class="input-group">
          <span v-if="veSystem">{{ veSystem.id }}</span>
          <span
            v-if="Object.keys(selectedPool).length > 0 && !veSystem"
            class="warning"
            >This Balancer Pool does not yet have a veGHO20 Voting Escrow System
            deployed yet. Please go to
            <a href="/vegho20/for-crypto-projects/step-2.html">Step 2</a> to
            deploy it.</span
          >
        </div>
      </div>
      <div v-for="field in formFields" :key="field.label" class="item-row">
        <p class="item-name">{{ field.label }}</p>
        <div class="input-group">
          <input
            :value="field.value"
            :placeholder="field.placeholder"
            type="text"
            class="input"
            disabled="true"
          />
        </div>
      </div>
      <article class="group-btn">
        <div>
          <UnlockAllModal
            :open="isUnlockAllModalOpen"
            :onClose="handleUnlockModalClose"
            :onUnlock="handleUnlock"
          />
          <p>
            <Tooltip
              tooltip="'Unclock All' can be called only once. After it contract becomes 90% useless

What does it mean?
Allows all users to withdraw their funds ahead of schedule. In case this option is activated, the contract effectively terminates (there is no turning back). New locks cannot be created.

Why would someone use it? Example 1:
The functionality can be useful, for example, if the owner has decided to terminate the reward program ahead of schedule.

How does it work?
Admin calls function set_all_unlock(), and afterwards all locks can be withdrawn before lock-finish time without any penalties
What may remain?
Users can withdraw their locks at any time since option is activated.
Why does it becomes useless? In which way?"
              >Status: {{ allUnlockStatus }}</Tooltip
            >
          </p>
          <button
            class="btn"
            :disabled="allUnlockStatus || isLoadingAllUnlock"
            @click="handleUnlockModalOpen"
          >
            {{ isLoadingAllUnlock ? 'Unlocking...' : 'Unlock All' }}
          </button>
        </div>
        <div>
          <EarlyUnlockModal
            :open="isEarlyUnlockModalOpen"
            :onClose="handleEarlyUnlockModalClose"
            :onUnlock="handleEarlyUnlock"
            :earlyUnlock="earlyUnlockStatus"
          />
          <p>
            <Tooltip
              tooltip="Early Unlock
Admin can enable or disable early unlock at any time"
              >Status: {{ earlyUnlockStatus }}</Tooltip
            >
          </p>
          <button
            class="btn"
            :disabled="isLoadingEarlyUnlock"
            @click="handleEarlyUnlockModalOpen"
          >
            {{ isLoadingEarlyUnlock ? 'Processing...' : 'Early Unlock' }}
          </button>
        </div>
        <div>
          <EarlyPenaltyModal
            :open="isEarlyPenaltyModalOpen"
            :onClose="handleEarlyPenaltyModalClose"
            :onSubmit="handleSetEarlyPenalty"
            :earlyPenalty="earlyPenalty"
          />
          <p>
            <Tooltip
              tooltip="Early Penalty

10
The penalty coefficient indicating the penalty speed for early unlock. Must be between 0 and 50. Default value is 10 means that penalty has linear speed.

If Early Penalty is set, can be it changed later, and if yes, by whom?

Why would someone use it?

How does it work? Lets review examples

Example 1: Early Penalty is set to 10. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens. 

Example 2: Early Penalty is set to 5. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens. 

Example 3: Early Penalty is set to 0. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens. 

Example 3: Early Penalty is set to 50. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens. 


Example 3: Early Penalty is set to 0. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens. 

Example 3: Early Penalty is set to 0. If user locked 1,000 tokens for 52 weeks (1 year). User wants to withdraw with penalty after 1 week, > she will withdraw ??? tokens. 
If user withdraws after 36 weeks, she will withdraw ??? tokens."
              >Early Penalty: {{ earlyPenalty }}</Tooltip
            >
          </p>
          <button
            class="btn"
            :disabled="isLoadingEarlyPenalty"
            @click="handleEarlyPenaltyModalOpen"
          >
            {{ isLoadingEarlyPenalty ? 'Processing...' : 'Set Early Penalty' }}
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.item-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.section-body {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-row .item-name {
  width: 50%;
  max-width: 350px;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.item-row .input-group {
  display: flex;
  align-items: center;
  height: 45px;
  width: 50%;
}

.item-row .input-group .input {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  height: 100%;
  width: 100%;
  max-width: 340px;
  padding-inline: 20px;
  font-size: 14px;
  outline: none;
}

.dark .item-row .input-group .input {
  border: 1px solid #3e4c5a;
}

.item-row .input-group .input:focus {
  border: 1px solid #384aff;
}

.group-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn {
  width: 180px;
  height: 40px;
  background-color: #384aff;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
}

.btn:disabled {
  cursor: not-allowed;
  background-color: rgba(56, 74, 255, 0.2);
  color: grey;
}

.select-pool {
  flex: 1;
}

.select-pool ul {
  width: 100%;
}

.input-group span.warning {
  color: red;
}

.item-row .custom-group {
  display: block;
}

.item-row .custom-group .select ul {
  width: 100%;
}
</style>

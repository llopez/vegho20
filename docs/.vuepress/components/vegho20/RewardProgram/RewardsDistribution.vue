<script setup lang="ts">
import SetAvailableRewardsForm from './SetAvailableRewardsForm.vue';
import AddRewardsCurrentWeek from './AddRewardsCurrentWeek.vue';
import AddRewardsNWeeks from './AddRewardsNWeeks.vue';
import AddRewardsExactWeek from './AddRewardsExactWeek.vue';
import { ref, computed, watch } from 'vue';
import AvailableRewardsModal from './AvailableRewardsModal.vue';
import { useVeSystem } from '../../../providers/veSystem';
import { ethers } from 'ethers';
import { Select, SelectTrigger, SelectOptions } from '../../Select';
import { usePools } from '../../../providers/pools';

const { pools, isLoading: isLoadingPools } = usePools();

const {
  selected: veSystem,
  data: veSystems,
  select: selectVeSystem,
} = useVeSystem();

const isModalOpen = ref<boolean>(false);

const handleCloseAvailableRewardsModal = () => {
  isModalOpen.value = false;
};

const handleOpenAvailableRewardsModal = () => {
  isModalOpen.value = true;
};

const availableRewards = computed(() => {
  if (!veSystem.value) return [];

  return veSystem.value.rewardDistributor.rewardTokens.map(rt => ({
    token: rt.name,
    amount: ethers.formatUnits(rt.availableRewardAmount || '0', rt.decimals),
  }));
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

watch(pools, value => {
  filteredPools.value = value;
  console.log(value);
});
</script>

<template>
  <div class="section-container">
    <div key="bla" class="item-row-selector">
      <p class="item-name">Select 8020 BPT address</p>
      <div class="select-pool">
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
    <div key="bla" class="item-row-selector">
      <p class="item-name">veSystem</p>
      <div class="select-pool">
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
    <SetAvailableRewardsForm />
    <AddRewardsCurrentWeek />
    <AddRewardsNWeeks />
    <AddRewardsExactWeek />
  </div>
  <div class="btn-group">
    <button class="available-button" @click="handleOpenAvailableRewardsModal">
      Available Rewards
    </button>
  </div>
  <AvailableRewardsModal
    :open="isModalOpen"
    :onClose="handleCloseAvailableRewardsModal"
    :rewards="availableRewards"
  >
  </AvailableRewardsModal>
</template>

<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
  margin-top: 16px;
}
.btn-group {
  margin-top: 30px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  max-width: 700px;
  height: 45px;
}
.available-button {
  width: 60px;
  height: 45px;
  background-color: #eaf0f6;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 600;
  font-size: 14px;
  box-shadow: none;
  border: none;
  width: 180px;
}
.dark .available-button {
  background-color: #384aff;
}
.available-button:disabled {
  background-color: rgba(56, 74, 255, 0.2);
  cursor: not-allowed;
}
.item-row-selector {
  display: flex;
  width: 100%;
  max-width: 700px;
  height: auto;
  gap: 10px;
}
.item-row-selector .item-name {
  width: 40%;
  max-width: 350px;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  height: 45px;
  display: flex;
  align-items: center;
}

.select-pool {
  flex: 1;
}

.select-pool ul {
  width: 100%;
}

.select-pool span.warning {
  color: red;
}
</style>

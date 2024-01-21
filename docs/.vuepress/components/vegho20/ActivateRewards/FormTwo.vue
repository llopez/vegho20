<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWeb3ModalProvider } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { BrowserProvider } from 'ethers';
import SuccessModal from './SuccessModal.vue';
import { Select, SelectTrigger, SelectOptions } from '../../Select';
import { usePools } from '../../../providers/pools';

const { pools, isLoading: isLoadingPools } = usePools();
const { network } = useNetwork();
const { walletProvider } = useWeb3ModalProvider();

const summary = ref();
const references = ref();
const protocolDesc = ref();
const motivation = ref();
const specifications = ref();
const governance = ref();
const oracles = ref();
const audits = ref();
const centralizationVectors = ref();
const marketHistory = ref();
const value = ref();
const gaugeContract = ref();
const rateProviderReview = ref();
const balancerMultisig = ref();
const corePoolStatus = ref<boolean>();

const loading = ref(false);
const isModalOpen = ref(false);

const response =
  'Nice move! Your Reward Program Activation is in progress. Check Reward Programs page for status of your request, or reach out via Discord for status check at any time.';

const message =
  "I confirm that I'm a representative of the project associated with the Balancer Pool Token containing at least 20% GHO and that 100% of the Reward granted under this program will be distributed only to those 0x addresses who lock BPT in the Voting Escrow contracts for a period of 4 months, or longer lock periods.";

const sign = async () => {
  if (!walletProvider.value) return;
  loading.value = true;

  try {
    const provider = new BrowserProvider(
      walletProvider.value,
      network.value.id
    );
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    console.log(signature);
    isModalOpen.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  isModalOpen.value = false;
};

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
};
</script>
<template>
  <form class="section-container" @submit.prevent="sign">
    <div key="bptToken" class="item-row">
      <p class="item-name">Select ve8020GHO BPT address</p>
      <div class="select">
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

    <div key="projectName" class="item-row area-row">
      <p class="item-name">Summary</p>
      <div class="input-group">
        <textarea v-model="summary" type="text" class="input" />
      </div>
    </div>

    <div key="references" class="item-row area-row">
      <p class="item-name">References</p>
      <div class="input-group">
        <textarea v-model="references" type="text" class="input" />
      </div>
    </div>

    <div key="Protocol Description" class="item-row area-row">
      <p class="item-name">Protocol Description</p>
      <div class="input-group">
        <textarea
          v-model="protocolDesc"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="motivation" class="item-row area-row">
      <p class="item-name">Motivation</p>
      <div class="input-group">
        <textarea
          v-model="motivation"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="specifications" class="item-row area-row">
      <p class="item-name">Specifications</p>
      <div class="input-group">
        <textarea
          v-model="specifications"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="governance" class="item-row area-row">
      <p class="item-name">Governance</p>
      <div class="input-group">
        <textarea
          v-model="governance"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="oracles" class="item-row">
      <p class="item-name">Oracles</p>
      <div class="input-group">
        <input
          v-model="oracles"
          placeholder="chainlink, etc"
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="audits" class="item-row area-row">
      <p class="item-name">Audits</p>
      <div class="input-group">
        <textarea v-model="audits" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="centralizationVectors" class="item-row area-row">
      <p class="item-name">Centralization Vectors</p>
      <div class="input-group">
        <textarea
          v-model="centralizationVectors"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="marketHistory" class="item-row area-row">
      <p class="item-name">Market History</p>
      <div class="input-group">
        <textarea
          v-model="marketHistory"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="value" class="item-row area-row">
      <p class="item-name">Value</p>
      <div class="input-group">
        <textarea v-model="value" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="gaugeContract" class="item-row">
      <p class="item-name">0x address of the Deployed Pool Gauge Contract</p>
      <div class="input-group">
        <input
          v-model="gaugeContract"
          placeholder="0x0.."
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="rateProviderReview" class="item-row">
      <p class="item-name">Rate Provider Review</p>
      <div class="input-group">
        <input
          v-model="rateProviderReview"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="balancerMultisig" class="item-row">
      <p class="item-name">The Balancer Maxi LM Multisig</p>
      <div class="input-group">
        <input
          v-model="balancerMultisig"
          placeholder="0x0.."
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="corePoolStatus" class="item-row">
      <p class="item-name">
        do you want to request a Core Pool status as per BIP-457
      </p>
      <div class="input-group">
        <label for="">yes</label>
        <input v-model="corePoolStatus" type="radio" value="true" />
        <label for="">no</label>
        <input v-model="corePoolStatus" type="radio" value="false" />
      </div>
    </div>

    <SuccessModal :open="isModalOpen" :onClose="handleClose">{{
      response
    }}</SuccessModal>
    <button type="submit" class="submit-button" :disabled="loading">
      Submit
    </button>
  </form>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.section-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
  margin-top: 16px;
}
.item-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  max-width: 700px;
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
  justify-content: flex-end;
  height: 45px;
  width: 50%;
}

.item-row .input-group .input {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  position: relative;
  border-radius: 6px;
  height: 100%;
  width: 100%;
  max-width: 340px;
  padding-inline: 20px;
  font-size: 14px;
  outline: none;
  display: flex;
  align-items: center;
}

.dark .item-row .input-group .input {
  border: 1px solid #3e4c5a;
}

.item-row .input-group .input:focus {
  border: 1px solid #384aff;
}

.item-row .input-group .input .icon {
  fill: #2c3e50;
  cursor: pointer;
}
.dark .item-row .input-group .input .icon {
  fill: #ffffff;
}
.item-row .input-group .input .text {
  font-size: 14px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0;
}
.item-row .input-group .input .text.disabled {
  color: #999;
}

.dark .item-row .input-group .input .text.disabled {
  color: #666;
}

.submit-button {
  width: 180px;
  height: 40px;
  background-color: #384aff;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 600;
  font-size: 14px;
  box-shadow: none;
  border: none;
}
.submit-button:disabled {
  background-color: rgba(56, 74, 255, 0.2);
  cursor: not-allowed;
}

.area-row {
  height: 200px;
}

.area-row .input-group textarea {
  height: 200px !important;
  padding: 5px !important;
  width: 367px !important;
}

.select {
  flex: 1;
}

.select ul {
  width: 100%;
}
</style>

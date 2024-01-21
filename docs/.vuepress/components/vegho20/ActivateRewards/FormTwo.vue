<script setup lang="ts">
import { ref } from 'vue';
import { useWeb3ModalProvider } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { BrowserProvider } from 'ethers';
import SuccessModal from './SuccessModal.vue';

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
</script>
<template>
  <form class="section-container" @submit.prevent="sign">
    <div key="projectName" class="item-row">
      <p class="item-name">Summary</p>
      <div class="input-group">
        <input
          v-model="summary"
          placeholder="Balancer"
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="references" class="item-row">
      <p class="item-name">References</p>
      <div class="input-group">
        <input
          v-model="references"
          placeholder="site1, site2, site3"
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="Protocol Description" class="item-row">
      <p class="item-name">Protocol Description</p>
      <div class="input-group">
        <input
          v-model="protocolDesc"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="motivation" class="item-row">
      <p class="item-name">Motivation</p>
      <div class="input-group">
        <input v-model="motivation" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="specifications" class="item-row">
      <p class="item-name">Specifications</p>
      <div class="input-group">
        <input
          v-model="specifications"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="governance" class="item-row">
      <p class="item-name">Governance</p>
      <div class="input-group">
        <input v-model="governance" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="oracles" class="item-row">
      <p class="item-name">Oracles</p>
      <div class="input-group">
        <input v-model="oracles" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="audits" class="item-row">
      <p class="item-name">Audits</p>
      <div class="input-group">
        <input v-model="audits" placeholder="" type="text" class="input" />
      </div>
    </div>

    <div key="centralizationVectors" class="item-row">
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

    <div key="marketHistory" class="item-row">
      <p class="item-name">Market History</p>
      <div class="input-group">
        <input
          v-model="marketHistory"
          placeholder=""
          type="text"
          class="input"
        />
      </div>
    </div>

    <div key="value" class="item-row">
      <p class="item-name">Value</p>
      <div class="input-group">
        <input v-model="value" placeholder="" type="text" class="input" />
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

.item-row .input-group,
.item-row .lock-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 45px;
  width: 50%;
}

.item-row .input-group .input,
.item-row .lock-group .input {
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

.dark .item-row .input-group .input,
.dark .item-row .lock-group .input {
  border: 1px solid #3e4c5a;
}

.item-row .input-group .input:focus,
.item-row .lock-group .input:focus {
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

.item-row .lock-group {
  gap: 8px;
  max-width: 340px;
  width: 50%;
}

.item-row .lock-group .time-group {
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 75px;
  width: 33%;
  position: relative;
}

.item-row .lock-group .time-group .input {
  width: 100%;
  padding: 0;
  padding-left: 12px;
  padding-top: 14px;
}
.time-group .text {
  margin: 0;
  font-size: 12px;
  position: absolute;
  top: 2px;
  left: 10px;
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
</style>

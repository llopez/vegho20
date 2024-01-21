<script setup lang="ts">
import { ref } from 'vue';
import { useWeb3ModalProvider } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { BrowserProvider } from 'ethers';

const { network } = useNetwork();
const { walletProvider } = useWeb3ModalProvider();

const field1 = ref();
const field2 = ref();

const message =
  "I confirm that I'm a representative of the project associated with the Balancer Pool Token containing at least 20% GHO and that 100% of the Reward granted under this program will be distributed only to those 0x addresses who lock BPT in the Voting Escrow contracts for a period of 4 months, or longer lock periods.";

const sign = async () => {
  if (!walletProvider.value) return;

  const provider = new BrowserProvider(walletProvider.value, network.value.id);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);
  console.log(signature);
};
</script>
<template>
  <form class="section-container" @submit.prevent="sign">
    <div key="field1" class="item-row">
      <p class="item-name">Field 1</p>
      <div class="input-group">
        <input
          v-model="field1"
          placeholder="field1"
          type="text"
          name="field1"
          class="input"
        />
      </div>
    </div>

    <div key="field2" class="item-row">
      <p class="item-name">Field 2</p>
      <div class="input-group">
        <input
          v-model="field2"
          placeholder="field2"
          type="text"
          name="field2"
          class="input"
        />
      </div>
    </div>
    <button type="submit" class="submit-button">Submit</button>
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

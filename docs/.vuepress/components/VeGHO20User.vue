<script setup>
import { createProviderComponent } from '../providers/createProviderComponent';
import { provideNetwork } from '../providers/network';
import { provideVeSystem } from '../providers/veSystem';
import TabsComponent from './vegho20/TabsComponent.vue';
import { providePools } from '../providers/pools';

const NetworkProvider = createProviderComponent(() => provideNetwork());
const VeSystemProvider = createProviderComponent(() => provideVeSystem());
const GlobalProvider = createProviderComponent(() => {
  providePools();
});
</script>

<template>
  <NetworkProvider>
    <GlobalProvider>
      <VeSystemProvider>
        <TabsComponent />
      </VeSystemProvider>
    </GlobalProvider>
  </NetworkProvider>
</template>
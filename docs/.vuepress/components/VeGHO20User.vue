<script setup>
import { createProviderComponent } from '../providers/createProviderComponent';
import { provideNetwork } from '../providers/network';
import { provideVeSystem } from '../providers/veSystem';
import { provideTabs, Tab } from '../providers/tabs';
import TabsComponent from './vegho20/TabsComponent.vue';

const NetworkProvider = createProviderComponent(() => provideNetwork());
const VeSystemProvider = createProviderComponent(() => provideVeSystem());
const TabsProvider = createProviderComponent(() => provideTabs(Tab.OVERVIEW));
</script>

<template>
  <NetworkProvider>
    <VeSystemProvider>
      <TabsProvider>
        <TabsComponent />
      </TabsProvider>
    </VeSystemProvider>
  </NetworkProvider>
</template>
<script setup>
import { createProviderComponent } from '../providers/createProviderComponent';
import { provideNetwork } from '../providers/network';
import { provideVeSystem } from '../providers/veSystem';
import { provideTabs, Tab } from '../providers/tabs';
import { providePools } from '../providers/pools';
import TabsComponent from './vegho20/admin/TabsComponent.vue';

const NetworkProvider = createProviderComponent(() => provideNetwork());
const VeSystemProvider = createProviderComponent(() => provideVeSystem());
const TabsProvider = createProviderComponent(() => provideTabs(Tab.LAUNCHPAD));
const GlobalProvider = createProviderComponent(() => {
  providePools();
});
</script>

<template>
  <NetworkProvider>
    <GlobalProvider>
      <VeSystemProvider>
        <TabsProvider>
          <TabsComponent />
        </TabsProvider>
      </VeSystemProvider>
    </GlobalProvider>
  </NetworkProvider>
</template>
<template>
  <div class="tools-container">
    <h3>Core Tools</h3>
    <div class="docs-cards tools-table">
      <div v-for="tool in coreTools" :key="tool.title" class="tools-row">
        <DocsCard
          :title="tool.title"
          :icon="tool.icon"
          :link="tool.link"
          :details="tool.details"
          :target="_getLinkTarget(tool.link)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsCard from './DocsCardTools.vue';

const coreTools = [
  {
    title: 've8020 Launchpad',
    icon: '/images/protofire.png',
    details: 'Launch a ve8020 system',
    link: '/tools/core/ve8020.html',
  },
  {
    title: 'Admin Panel - ve8020',
    icon: '/images/protofire.png',
    details: 'Admin Panel for ve8020 system',
    link: '/tools/core/admin-ve8020.html',
  },
  // Add more Core Tools as needed
];

// Function to check if a link is external
function isExternalLink(link) {
  return link.startsWith('http://') || link.startsWith('https://');
}

// Function to get the target attribute for the link
function _getLinkTarget(link) {
  return isExternalLink(link) ? '_blank' : '_self';
}
</script>

<style scoped>
.tools-container {
  max-width: 1200px;
  margin: 0 auto;
}

.docs-cards {
  grid-gap: 1.35rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding-bottom: 2em;
}

.tools-row {
  /* Adjust the styles for each row of tools (DocsCard components) */
}

/* Add any additional styles as needed */
</style>

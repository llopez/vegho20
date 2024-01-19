<script setup>
import JoinForm from './JoinForm.vue';

defineProps({
  pool: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="card">
    <div style="padding: 16px 0">
      <JoinForm :pool="pool" />
    </div>
  </div>
</template>
<style scoped>
.card {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 0 16px;
}

.dark .card {
  background-color: transparent;
  border-color: #3e4c5a;
}

.tabs {
  align-items: center;
  display: flex;
}

.tab {
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  padding: 16px 0;
  width: 100%;
}

.dark .tab {
  border-color: #3e4c5a;
  color: #fff;
}

.tab:not(.tab--active):hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.dark .tab:not(.tab--active):hover {
  background-color: #1e293b;
  border-color: #64748b;
  color: #fff;
}

.tab--active {
  color: #384aff;
  border-color: #384aff;
}

.dark .tab--active {
  color: #4c5eff;
  border-color: #4c5eff;
}
</style>

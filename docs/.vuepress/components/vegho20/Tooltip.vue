<script setup lang="ts">
defineProps({
  tooltip: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="tooltip">
    <slot></slot>
    &nbsp;
    <div class="copy-btn" :title="tooltip">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="50px"
        height="50px"
      >
        <path
          d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"
        />
      </svg>
    </div>
  </div>
</template>
<style scoped>
.tooltip {
  display: flex;
}

.copy-btn {
  background-color: #f8fafc;
  border: 0;
  color: #94a3b8;
  padding: 0;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out color 0.2s ease-in-out;
}

.dark .copy-btn {
  background-color: #334155;
  color: #94a3b8;
}

.copy-btn:hover {
  background-color: #eaf0f6;
  color: #5668ff;
  cursor: pointer;
}

.dark .copy-btn:hover {
  background-color: #1e293b;
}

.copy-btn svg {
  height: 14px;
  width: 14px;
}
</style>
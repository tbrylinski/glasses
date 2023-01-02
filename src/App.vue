<script>
export default {
  name: 'App',
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="postcss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

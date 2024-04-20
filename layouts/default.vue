<template>
  <section class="grid" style="min-height: 100vh">
    <aside>Sidebar</aside>
    <div>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 6fr;
}
</style>

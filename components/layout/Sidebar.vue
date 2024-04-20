<script setup lang="ts"></script>

<template>
  <aside class="px-5 py-8">
    <div class="flex items-start justify-end">
      <UTooltip
        text="Перейти на Главный экран"
        :popper="{ arrow: true, placement: 'top' }"
      >
        <NuxtLink to="/">
          <NuxtImg src="/logo.svg" alt="AWP logo" width="100px" />
        </NuxtLink>
      </UTooltip>
      <UTooltip
        text="Выйти из системы"
        :popper="{ arrow: true, placement: 'right' }"
      >
        <UButton
          icon="i-heroicons-arrow-left-end-on-rectangle"
          size="xl"
          color="primary"
          variant="link"
        />
      </UTooltip>
    </div>
  </aside>
</template>

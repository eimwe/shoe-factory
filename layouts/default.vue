<script setup lang="ts">
import { useIsLoadingStore } from "~/store/loading.store";
import { useAuthStore } from "~/store/auth.store";

const isLoadingStore = useIsLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const user = await account.get();
    if (user) authStore.set(user);
  } catch (error) {
    router.push("/login");
  } finally {
    isLoadingStore.set(false);
  }
});
</script>

<template>
  <LayoutLoader v-if="isLoadingStore.isLoading" />
  <section v-else :class="authStore.isAuth ? 'grid grid-cols-[1fr_6fr]' : ''">
    <LayoutSidebar v-if="authStore.isAuth" />
    <div>
      <slot />
    </div>
  </section>
</template>

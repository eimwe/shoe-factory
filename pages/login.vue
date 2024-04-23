<script setup lang="ts">
import type { FormError } from "#ui/types";
import { useIsLoadingStore } from "~/store/loading.store";
import { useAuthStore } from "~/store/auth.store";

useHead({
  title: "Вход в АРМ",
});

const isLoadingStore = useIsLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

const state = reactive({
  email: "",
  password: "",
});

const hiddenPassword = ref(true);

const login = async () => {
  isLoadingStore.set(true);

  try {
    await account.createEmailPasswordSession(state.email, state.password);

    const response = await account.get();

    if (response) {
      authStore.set({
        email: response.email,
        status: response.status,
      });
    }

    state.email = "";
    state.password = "";

    await router.push("/");
  } catch (error) {
    console.error(error);
  }

  isLoadingStore.set(false);
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};
</script>

<template>
  <div class="grid min-h-screen place-items-center content-center gap-2">
    <UIcon name="i-heroicons-users" class="h-20 w-20 bg-emerald-400" />
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="login"
    >
      <UInput
        v-model="state.email"
        icon="i-heroicons-at-symbol"
        size="xl"
        type="email"
        color="primary"
        variant="outline"
        placeholder="E-mail"
        required
      />

      <UInput
        v-model="state.password"
        size="xl"
        :type="hiddenPassword ? 'password' : 'text'"
        color="primary"
        variant="outline"
        placeholder="Пароль"
        required
        class="text-emerald-400"
      >
        <template #leading>
          <UIcon v-if="hiddenPassword" name="i-heroicons-eye" class="h-6 w-6" />
          <UIcon v-else name="i-heroicons-eye-slash" class="h-6 w-6" />
          <UCheckbox
            v-model="hiddenPassword"
            :ui="{
              base: 'cursor-pointer absolute right-0 h-6 w-6 bg-none dark:bg-none dark:checked:bg-transparent dark:checked:border-transparent dark:indeterminate:bg-transparent dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent',
              form: 'bg-none form-checkbox',
              color: 'text-transparent dark:text-transparent',
              background: 'bg-none bg-transparent dark:bg-transparent',
              border: 'border border-transparent dark:border-transparent',
              ring: 'focus-visible:ring-0 focus-visible:ring-transparent dark:focus-visible:ring-transparent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-offset-transparent',
            }"
            class="pointer-events-auto"
          />
        </template>
      </UInput>

      <UButton size="xl" type="submit" block> Войти </UButton>
    </UForm>
  </div>
</template>

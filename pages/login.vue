<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

useHead({
  title: "Вход в АРМ",
});

const state = reactive({
  email: undefined,
  password: undefined,
});

const userPassword = ref("");
const hiddenPassword = ref(true);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data);
}
</script>

<template>
  <div class="grid min-h-screen place-items-center content-center gap-2">
    <UIcon name="i-heroicons-users" class="h-20 w-20 bg-emerald-400" />
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UInput
        icon="i-heroicons-user"
        size="xl"
        type="text"
        color="primary"
        variant="outline"
        placeholder="Логин"
        required
      />

      <UInput
        v-model="userPassword"
        size="xl"
        :type="hiddenPassword ? 'password' : 'text'"
        color="primary"
        variant="outline"
        placeholder="Пароль"
        required
        class="text-emerald-400"
      >
        <template #leading>
          <UIcon
            v-if="hiddenPassword"
            name="i-heroicons-eye-slash"
            class="h-6 w-6"
          />
          <UIcon v-else name="i-heroicons-eye" class="h-6 w-6" />
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

<script setup lang="ts">
import type { ITask, IApiGetDocResponse } from "@/types/index";
import { formatTimestamp } from "~/utils/formatTimestamp";

const props = defineProps<{
  id?: string;
}>();

const isLoading = ref(false);
const task: Ref<ITask | null> = ref(null);

onMounted(async () => {
  isLoading.value = true;

  const { result }: IApiGetDocResponse = await $fetch(
    `/api/queryDoc?col=tasks&id=${props.id}`,
  );

  if (result) {
    task.value = {
      id: result.id,
      product: result.product,
      status: result.status,
      equipment: result.equipment,
      materials: result.materials,
      staff: result.staff,
      amount: result.amount,
      start_date: result.start_date,
      end_date: result.end_date,
      startDateFormatted: formatTimestamp(result.start_date.seconds),
      endDateFormatted: formatTimestamp(result.end_date.seconds),
    };
  }

  isLoading.value = false;
});
</script>

<template>
  <LayoutLoader v-if="isLoading" />
  <div v-else>
    <h2 class="mb-10 mt-8 text-center text-3xl font-bold">
      Редактирование задания
    </h2>
  </div>
</template>

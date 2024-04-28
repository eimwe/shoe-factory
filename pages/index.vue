<script setup lang="ts">
import type { Ref } from "vue";
import type { ITask } from "@/types/index";

useHead({
  title: "Главный экран",
});

const columns = [
  {
    key: "startDateFormatted",
    label: "Дата начала",
  },
  {
    key: "endDateFormatted",
    label: "Дата выпуска",
  },
  {
    key: "amount",
    label: "Партия",
  },
  {
    key: "product.title",
    label: "Изделие",
  },
  {
    key: "status.title",
    label: "Текущий процесс",
  },
  {
    key: "equipment",
    label: "Инвентарь",
  },
  {
    key: "materials",
    label: "Сырье",
  },
  {
    key: "staff",
    label: "Персонал",
  },
  {
    key: "menu",
  },
];

const items = (row: ITask) => [
  [
    {
      label: "Редактировать",
      icon: "i-heroicons-pencil-square",
      click: () => handleSlideOver(row.id as ITask["id"]),
    },
    {
      label: "Удалить",
      icon: "i-heroicons-trash",
    },
  ],
];

const tasks: Ref<ITask[]> = ref([]);
const isLoading = ref(false);
const isOpen = ref(false);
const taskId = ref("");

onMounted(async () => {
  isLoading.value = true;
  const { result } = await $fetch("/api/query?col=tasks");

  tasks.value = result.map((task: any) => ({
    id: task.id,
    start_date: task.start_date,
    end_date: task.end_date,
    startDateFormatted: formatTimestamp(task.start_date.seconds),
    endDateFormatted: formatTimestamp(task.end_date.seconds),
    amount: task.amount,
    product: task.product,
    status: task.status,
    equipment: task.equipment
      .map((equipment: any) => equipment.title)
      .join("\r\n"),
    materials: task.materials
      .map((material: any) => material.title)
      .join("\r\n"),
    staff: task.staff.map((employee: any) => employee.name).join("\r\n"),
  }));

  isLoading.value = false;
});

const formatTimestamp = (seconds: number): string => {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
};

const handleSlideOver = (rowId: string) => {
  taskId.value = rowId;
  isOpen.value = !isOpen.value ? true : false;
};
</script>

<template>
  <h1 class="mb-10 mt-8 text-3xl font-bold">
    Серийное производство на фабрике
  </h1>
  <UTable
    :loading="isLoading"
    :loading-state="{
      icon: 'i-heroicons-arrow-path-20-solid',
      label: 'Данные загружаются...',
    }"
    :empty-state="{
      icon: 'i-heroicons-table-cells',
      label: 'Таблица пуста',
    }"
    :progress="{ color: 'primary', animation: 'carousel' }"
    :columns="columns"
    :rows="tasks"
    :ui="{
      td: {
        base: 'whitespace-break-spaces',
      },
    }"
  >
    <template #menu-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="primary"
          variant="ghost"
          icon="i-heroicons-ellipsis-vertical"
        />
      </UDropdown>
    </template>
  </UTable>
  <USlideover v-model="isOpen"> </USlideover>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { Timestamp } from "firebase/firestore";

useHead({
  title: "Главный экран",
});

interface CollectionProperties {
  id: string;
  title: string;
}

interface Materials extends CollectionProperties {}

interface Products extends CollectionProperties {}

interface Statuses extends CollectionProperties {}

interface Equipment extends CollectionProperties {
  type: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  product: Products;
  status: Statuses;
  equipment: Equipment[];
  materials: Materials[];
  staff: Staff[];
  amount: number;
  start_date: Timestamp;
  end_date: Timestamp;
  startDateFormatted: string;
  endDateFormatted: string;
}

const columns = [
  {
    key: "startDateFormatted",
    label: "Дата начала",
  },
  {
    key: "endDateFormatted",
    label: "Дата завершения",
  },
  {
    key: "amount",
    label: "Количество",
  },
  {
    key: "product.title",
    label: "Название изделия",
  },
  {
    key: "status.title",
    label: "Текущий процесс",
  },
  {
    key: "equipment",
    label: "Оборудование",
  },
  {
    key: "materials",
    label: "Сырье",
  },
  {
    key: "staff",
    label: "Сотрудники",
  },
];

const tasks: Ref<Task[]> = ref([]);
const isLoading = ref(false);

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
      .join(", "),
    materials: task.materials.map((material: any) => material.title).join(", "),
    staff: task.staff.map((employee: any) => employee.name).join(", "),
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
</script>

<template>
  <div>
    <h1 class="mb-4 mt-4 text-center text-xl font-bold capitalize">
      <abbr
        title="Автоматизированное рабочее место"
        class="uppercase no-underline"
        >Арм</abbr
      >
      технолога
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
      class="w-full"
      :columns="columns"
      :rows="tasks"
    />
  </div>
</template>

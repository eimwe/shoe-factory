<script setup lang="ts">
import type { ITask, IStaff, IStatuses } from "@/types/index";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { Timestamp } from "firebase/firestore";

const props = defineProps<{
  id?: string;
}>();

const isLoading = ref(false);
const task: Ref<ITask | null> = ref(null);
const state: ITask = reactive({
  id: "",
  product: { id: "", title: "" },
  status: { id: "", title: "" },
  equipment: [],
  materials: [],
  staff: [],
  amount: 0,
  start_date: new Timestamp(1212121, 121212121),
  end_date: new Timestamp(1212121, 121212121),
  startDateFormatted: "",
  endDateFormatted: "",
});
const selectedStaff = ref<IStaff[]>([]);
const staffOptions: Ref<IStaff[]> = ref([]);
const selectedStatus = ref<IStatuses["title"]>("");
const statusOptions: Ref<IStatuses[]> = ref([]);

onMounted(async () => {
  isLoading.value = true;
  //@ts-ignore
  const { result: staff } = (await $fetch("/api/query?col=staff")) as IStaff[];

  const staffList: IStaff[] = staff.map((staffItem: IStaff) => ({
    id: staffItem.id,
    name: staffItem.name,
  }));

  staffOptions.value = staffList;

  //@ts-ignore
  const { result: status } = (await $fetch(
    "/api/query?col=statuses",
  )) as IStatuses[];

  const statusList: IStatuses[] = status.map((statusItem: IStatuses) => ({
    id: statusItem.id,
    title: statusItem.title,
  }));

  statusOptions.value = statusList;

  //@ts-ignore
  const { result: currentTask } = (await $fetch(
    `/api/queryDoc?col=tasks&id=${props.id}`,
  )) as ITask;

  if (currentTask) {
    task.value = {
      id: currentTask.id,
      product: currentTask.product,
      status: currentTask.status,
      equipment: currentTask.equipment,
      materials: currentTask.materials,
      staff: currentTask.staff,
      amount: currentTask.amount,
      start_date: currentTask.start_date,
      end_date: currentTask.end_date,
      startDateFormatted: formatTimestamp(currentTask.start_date.seconds),
      endDateFormatted: formatTimestamp(currentTask.end_date.seconds),
    };

    selectedStatus.value = task.value.status.title;
  }

  watch(
    task,
    (newValue) => {
      if (newValue) {
        // Update state properties with task.value data
        state.product = newValue.product;
        state.status = newValue.status;
        state.equipment = newValue.equipment;
        state.materials = newValue.materials;
        state.staff = newValue.staff;
        state.amount = newValue.amount;
        state.start_date = newValue.start_date;
        state.end_date = newValue.end_date;
        state.startDateFormatted = formatTimestamp(newValue.start_date.seconds);
        state.endDateFormatted = formatTimestamp(newValue.end_date.seconds);
      }
    },
    { immediate: true },
  );

  isLoading.value = false;
});

const selectedStaffNames = computed(() => {
  if (!state.staff || !staffOptions.value || !task.value) return [];

  const taskStaffNames = task.value.staff.map((staffItem) => staffItem.name);

  return staffOptions.value.filter((staffMember) =>
    taskStaffNames.includes(staffMember.name),
  );
});

watch(
  selectedStaffNames,
  (newStaffNames) => {
    selectedStaff.value = newStaffNames;
  },
  { immediate: true },
);
</script>

<template>
  <LayoutLoader v-if="isLoading" />
  <div v-else>
    <h2 class="mb-10 mt-8 text-center text-3xl font-bold">
      Редактирование задания
    </h2>
    <UForm
      :state="state"
      class="space-y-4 px-4"
      @submit="console.log('submitted')"
    >
      <div class="flex gap-2">
        <UFormGroup label="Дата начала">
          <UInput
            v-model="state.startDateFormatted"
            size="xl"
            type="text"
            color="primary"
            variant="outline"
            placeholder="Укажите дату начала"
            required
            disabled
          />
        </UFormGroup>

        <UFormGroup label="Дата выпуска">
          <UInput
            v-model="state.endDateFormatted"
            size="xl"
            type="text"
            color="primary"
            variant="outline"
            placeholder="Укажите дату завершения"
            required
            disabled
          />
        </UFormGroup>
      </div>
      <div class="flex gap-2">
        <UFormGroup label="Партия">
          <UInput
            v-model="state.amount"
            size="xl"
            type="number"
            color="primary"
            variant="outline"
            placeholder="Укажите количество"
            required
          />
        </UFormGroup>

        <UFormGroup label="Изделие">
          <UInput
            v-model="state.product.title"
            size="xl"
            type="text"
            color="primary"
            variant="outline"
            placeholder="Укажите название изделия"
            required
            disabled
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Текущий процесс">
        <USelectMenu
          v-model="selectedStatus"
          :options="statusOptions"
          size="xl"
          color="primary"
          variant="outline"
          option-attribute="title"
          required
        />
      </UFormGroup>

      <UFormGroup label="Персонал">
        <USelectMenu
          v-model="selectedStaff"
          :options="staffOptions"
          multiple
          size="xl"
          color="primary"
          variant="outline"
          option-attribute="name"
          required
        >
          <template #label>
            <template v-if="selectedStaff.length">
              <span
                >{{ selectedStaff.length }} выбран{{
                  selectedStaff.length > 1 ? "о" : ""
                }}</span
              >
            </template>
            <template v-else>
              <span class="truncate text-gray-600 dark:text-gray-500"
                >Выберите сотрудников</span
              >
            </template>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UButton size="xl" type="submit" block> Сохранить </UButton>
    </UForm>
  </div>
</template>

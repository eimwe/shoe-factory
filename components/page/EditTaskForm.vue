<script setup lang="ts">
import type { ITask, IStaff } from "@/types/index";
import { formatTimestamp } from "~/utils/formatTimestamp";
import type { FormError } from "#ui/types";
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

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.product) errors.push({ path: "product", message: "Required" });
  if (!state.status) errors.push({ path: "status", message: "Required" });
  if (!state.equipment) errors.push({ path: "equipment", message: "Required" });
  if (!state.materials) errors.push({ path: "materials", message: "Required" });
  if (!state.staff) errors.push({ path: "staff", message: "Required" });
  if (!state.amount) errors.push({ path: "amount", message: "Required" });
  if (!state.start_date)
    errors.push({ path: "start_date", message: "Required" });
  if (!state.end_date) errors.push({ path: "end_date", message: "Required" });
  return errors;
};

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
      :validate="validate"
      :state="state"
      class="space-y-4 px-4"
      @submit="console.log('submitted')"
    >
      <UFormGroup label="Партия">
        <UInput
          v-model="state.amount"
          size="xl"
          type="nember"
          color="primary"
          variant="outline"
          placeholder="Укажите количество"
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
                >{{ selectedStaff.length }} сотрудник{{
                  selectedStaff.length > 1 ? "а" : ""
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

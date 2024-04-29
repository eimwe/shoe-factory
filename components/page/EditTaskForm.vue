<script setup lang="ts">
import type {
  ITask,
  IStaff,
  IStatuses,
  IEquipment,
  IMaterials,
} from "@/types/index";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { Timestamp } from "firebase/firestore";
import { set } from "@/server/lib/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/server/lib/firebase";

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
//const selectedStatus = ref<IStatuses["title"]>("");
const selectedStatus = ref<IStatuses | null>(null);
const statusOptions: Ref<IStatuses[]> = ref([]);
const selectedTools = ref<IEquipment[]>([]);
const toolOptions: Ref<IEquipment[]> = ref([]);
const selectedMaterials = ref<IMaterials[]>([]);
const materialOptions: Ref<IMaterials[]> = ref([]);

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
  const { result: tools } = (await $fetch(
    "/api/query?col=equipment",
  )) as IEquipment[];

  const toolList: IEquipment[] = tools.map((tool: IEquipment) => ({
    id: tool.id,
    title: tool.title,
  }));

  toolOptions.value = toolList;

  //@ts-ignore
  const { result: materials } = (await $fetch(
    "/api/query?col=materials",
  )) as IMaterials[];

  const materialList: IMaterials[] = materials.map((material: IMaterials) => ({
    id: material.id,
    title: material.title,
  }));

  materialOptions.value = materialList;

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

    //selectedStatus.value = task.value.status.title;

    // Find the status object with the matching title
    const defaultStatus = statusOptions.value.find(
      (status) => status.title === task.value?.status.title,
    );

    // Assign the found status object to selectedStatus
    if (defaultStatus) {
      selectedStatus.value = defaultStatus;
    }
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

const selectedToolTitles = computed(() => {
  if (!state.equipment || !toolOptions.value || !task.value) return [];

  const taskToolTitles = task.value.equipment.map((tool) => tool.title);

  return toolOptions.value.filter((tool) =>
    taskToolTitles.includes(tool.title),
  );
});

watch(
  selectedToolTitles,
  (newToolTitles) => {
    selectedTools.value = newToolTitles;
  },
  { immediate: true },
);

const selectedMaterialTitles = computed(() => {
  if (!state.materials || !materialOptions.value || !task.value) return [];

  const taskMaterailTitles = task.value.materials.map(
    (material) => material.title,
  );

  return materialOptions.value.filter((material) =>
    taskMaterailTitles.includes(material.title),
  );
});

watch(
  selectedMaterialTitles,
  (newMaterialTitles) => {
    selectedMaterials.value = newMaterialTitles;
  },
  { immediate: true },
);

const editDoc = async () => {
  isLoading.value = true;

  const editedDoc = {
    product: doc(FIRESTORE_DB, `/products/${state.product.id}`),
    status: doc(FIRESTORE_DB, `/statuses/${selectedStatus.value?.id}`),
    equipment: selectedTools.value.map((tool) =>
      doc(FIRESTORE_DB, `/equipment/${tool.id}`),
    ),
    materials: selectedMaterials.value.map((material) =>
      doc(FIRESTORE_DB, `/materials/${material.id}`),
    ),
    staff: selectedStaff.value.map((staff) =>
      doc(FIRESTORE_DB, `/staff/${staff.id}`),
    ),
    amount: state.amount,
    start_date: new Timestamp(
      state.start_date.seconds,
      state.start_date.nanoseconds,
    ),
    end_date: new Timestamp(state.end_date.seconds, state.end_date.nanoseconds),
  };

  try {
    //await $fetch(`/api/set?col=tasks&id=${editedDoc}`);
    //await set("tasks", editedDoc);

    await updateDoc(doc(FIRESTORE_DB, "/tasks/", `${props.id}`), editedDoc);

    //await router.push("/");
  } catch (error) {
    console.error(error);
  }

  isLoading.value = true;
};
</script>

<template>
  <LayoutLoader v-if="isLoading" />
  <div v-else>
    <h2 class="mb-10 mt-8 text-center text-3xl font-bold">
      Редактирование задания
    </h2>
    <UForm :state="state" class="space-y-4 px-4" @submit="editDoc">
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
          placeholder="Выберите стадию производства"
          required
        />
      </UFormGroup>

      <UFormGroup label="Инвентарь">
        <USelectMenu
          v-model="selectedTools"
          :options="toolOptions"
          multiple
          size="xl"
          color="primary"
          variant="outline"
          option-attribute="title"
          required
        >
          <template #label>
            <template v-if="selectedTools.length">
              <span
                >{{ selectedTools.length }} выбран{{
                  selectedTools.length > 1 ? "о" : ""
                }}</span
              >
            </template>
            <template v-else>
              <span class="truncate text-gray-600 dark:text-gray-500"
                >Выберите оборудование</span
              >
            </template>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup label="Сырье">
        <USelectMenu
          v-model="selectedMaterials"
          :options="materialOptions"
          multiple
          size="xl"
          color="primary"
          variant="outline"
          option-attribute="title"
          required
        >
          <template #label>
            <template v-if="selectedMaterials.length">
              <span
                >{{ selectedMaterials.length }} выбран{{
                  selectedMaterials.length > 1 ? "о" : ""
                }}</span
              >
            </template>
            <template v-else>
              <span class="truncate text-gray-600 dark:text-gray-500"
                >Выберите наименования сырья</span
              >
            </template>
          </template>
        </USelectMenu>
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

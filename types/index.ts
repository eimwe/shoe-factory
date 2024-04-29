import type { Timestamp } from "firebase/firestore";

interface ICollectionProperties {
  id: string;
  title: string;
}

interface IMaterials extends ICollectionProperties {}

interface IProducts extends ICollectionProperties {}

interface IStatuses extends ICollectionProperties {}

interface IEquipment extends ICollectionProperties {
  type: string;
}

interface IStaff {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ITask {
  id: string;
  product: IProducts;
  status: IStatuses;
  equipment: IEquipment[];
  materials: IMaterials[];
  staff: IStaff[];
  amount: number;
  start_date: Timestamp;
  end_date: Timestamp;
  startDateFormatted: string;
  endDateFormatted: string;
}

export type { ITask, IStaff, IStatuses, IEquipment, IMaterials };

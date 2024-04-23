import { defineStore } from "pinia";

interface IAuthStore {
  email: string;
  status: boolean;
}

const defaultValue: { user: IAuthStore } = {
  user: {
    email: "",
    status: false,
  },
};

export const useAuthStore = defineStore("auth", {
  state: () => defaultValue,
  getters: {
    isAuth: (state) => state.user.status,
  },
  actions: {
    clear() {
      this.$patch(defaultValue);
    },
    set(input: IAuthStore) {
      this.$patch({ user: input });
    },
  },
});

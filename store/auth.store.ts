import { defineStore } from "pinia";

interface IAuthStore {
  username: string;
  status: boolean;
}

const defaultValue: { user: IAuthStore } = {
  user: {
    username: "",
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

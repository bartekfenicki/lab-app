import { defineStore } from "pinia";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [] as any[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    // ✅ Fetch users for a company
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = "http://localhost:5001/api/users";
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch users");
        this.users = await res.json();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // ✅ Create user
    async createUser(payload: any) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = "http://localhost:5001/api/users";
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create user");

        const newUser = await res.json();
        this.users.unshift(newUser);
        return newUser;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ✅ Delete user
    async deleteUser(userId: number) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = `http://localhost:5001/api/users/${userId}`;
        const res = await fetch(API_URL, { method: "DELETE" });

        if (!res.ok) throw new Error("Failed to delete user");
        this.users = this.users.filter(u => u.user_id !== userId);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});

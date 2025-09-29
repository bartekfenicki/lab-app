import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

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
  async updateUserWithFormData(userId: number, formData: FormData) {
  this.loading = true;
  this.error = null;
  try {
    const authStore = useAuthStore();

    const res = await fetch(`http://localhost:5001/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")!).token : ""}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update user");
    }

    const updatedUser = await res.json();

    // ✅ Update users array if it exists
    this.users = this.users.map((u) =>
      u.user_id === userId ? updatedUser : u
    );

    // ✅ Sync with authStore (so UI updates instantly)
    if (authStore.user?.user_id === updatedUser.user_id) {
      authStore.user = updatedUser;
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: updatedUser, token: authStore.token })
      );
    }

    return updatedUser;
  } catch (err: any) {
    this.error = err.message || "Failed to update user";
    return null;
  } finally {
    this.loading = false;
  }
}


  },
});

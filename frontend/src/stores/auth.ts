import { defineStore } from "pinia";
import { useCompanyStore } from "./company";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async registerFirstUser(payload: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone?: string;
    }) {
      this.loading = true;
      this.error = null;

      try {
        const companyStore = useCompanyStore();
        if (!companyStore.company) {
          throw new Error("No company registered yet");
        }

        const API_URL = "http://localhost:5001/api/users";

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            company_id: companyStore.company.company_id,
            role_id: 1,
            email_verified: false,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to register user");
        }

        const data = await res.json();
        this.user = data;
        return true;
      } catch (err: any) {
        this.error = err.message || "Failed to register user";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loginUser(payload: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const companyStore = useCompanyStore();
        const res = await fetch("http://localhost:5001/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Login failed");
        }

        const data = await res.json();
        this.user = data.user;
        this.token = data.token;
        await companyStore.fetchCompanyById(this.user.company_id);

        // ✅ Persist session
        localStorage.setItem("auth", JSON.stringify({ user: this.user, token: this.token }));

        return true;
      } catch (err: any) {
        this.error = err.message || "Login failed";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logoutUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth");
    },

    restoreSession() {
      const saved = localStorage.getItem("auth");
      if (saved) {
        const { user, token } = JSON.parse(saved);
        this.user = user;
        this.token = token;
        const companyStore = useCompanyStore();
        companyStore.fetchCompanyById(this.user.company_id);
      }
    },
  },
});

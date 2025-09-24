import { defineStore } from "pinia";

export interface Role {
  role_id: number;
  company_id: number;
  name: string;
  created_at: string;
  permissions: string;
}

export const useRoleStore = defineStore("roles", {
  state: () => ({
    roles: [] as Role[],
    defaultRoles: [] as Role[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // ✅ Fetch all roles (all companies)
    async fetchAllRoles() {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = "http://localhost:5001/api/roles";
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        this.roles = data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // ✅ Fetch roles by company_id
    async fetchRolesByCompany(companyId: number) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = `http://localhost:5001/api/roles/company/${companyId}`;
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch company roles");
        const data = await res.json();
         console.log("📌 Default roles fetched:", data);
        this.roles = data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

  // ✅ Fetch default roles (always company_id = 1)
    async fetchDefaultRoles() {
        this.loading = true;
        this.error = null;
        try {
        const API_URL = "http://localhost:5001/api/roles/company/1";
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch default roles");
        const data = await res.json();
        console.log("📌 Default roles fetched:", data);

        this.defaultRoles = data;
        } catch (err: any) {
        this.error = err.message;
        } finally {
        this.loading = false;
        }
    },

    // ✅ Create a new role
    async createRole(payload: { company_id: number; name: string; permissions: string }) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = "http://localhost:5001/api/roles";
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create role");
        }

        const newRole = await res.json();
        this.roles.push(newRole);
        return newRole;
      } catch (err: any) {
        this.error = err.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // ✅ Delete role
    async deleteRole(roleId: number) {
        this.loading = true;
        this.error = null;
        try {
            const API_URL = `http://localhost:5001/api/roles/${roleId}`;
            const res = await fetch(API_URL, { method: "DELETE" });

            if (!res.ok) throw new Error("Failed to delete role");

            // remove from state
            this.roles = this.roles.filter(r => r.role_id !== roleId);
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
        },
  },
});

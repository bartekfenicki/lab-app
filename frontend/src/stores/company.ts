import { defineStore } from "pinia";

export const useCompanyStore = defineStore("company", {
  state: () => ({
    company: null as any | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async registerCompany(companyData: any) {
      try {
        const API_URL = "http://localhost:5001/api/companies";
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
        });
        if (!res.ok) throw new Error("Failed to register company");
        this.company = await res.json();
        this.error = null;
      } catch (err: any) {
        this.error = err.message || "Unknown error";
      }
    },
    async fetchCompanyById(companyId: number) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = `http://localhost:5001/api/companies/${companyId}`;
        const res = await fetch(API_URL);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch company");
        }

        const data = await res.json();
        this.company = data;
      } catch (err: any) {
        this.error = err.message || "Failed to fetch company";
      } finally {
        this.loading = false;
      }
    },
    async updateCompany(companyId: number, companyData: any) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = `http://localhost:5001/api/companies/${companyId}`;
        const res = await fetch(API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to update company");
        }

        const updatedCompany = await res.json();
        this.company = updatedCompany;
      } catch (err: any) {
        this.error = err.message || "Failed to update company";
      } finally {
        this.loading = false;
      }
    },
  },
});

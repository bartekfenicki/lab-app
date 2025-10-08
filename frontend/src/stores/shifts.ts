import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export interface Shift {
  shift_id?: number;
  company_id: number;
  role_id: number;
  user_id: number;
  date: string; // ISO string
  assigned_start_time: string; // HH:mm:ss
  assigned_end_time: string; 
  start_time: string | null, 
  end_time: string | null,  // HH:mm:ss
  status: string;
}

interface ShiftState {
  shifts: Shift[];
}

export const useShiftStore = defineStore("shift", {
  state: (): ShiftState => ({
    shifts: [],
  }),
  actions: {
    async fetchCompanyShifts(company_id: number) {
      try {
        const API_URL = `http://localhost:5001/api/shifts/company/${company_id}`;
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch shifts");
        this.shifts = await res.json();
      } catch (error) {
        console.error(error);
      }
    },

    async createShift(shift: Shift) {
      try {
        const API_URL = `http://localhost:5001/api/shifts/`;
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shift),
        });
        if (!res.ok) throw new Error("Failed to create shift");
        const data = await res.json();
        this.shifts.push(data);
        this.shifts = [...this.shifts, data];
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteShift(shift_id: number) {
      try {
        const API_URL = `http://localhost:5001/api/shifts/${shift_id}`
        const res = await fetch(API_URL, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete shift");
        this.shifts = this.shifts.filter(s => s.shift_id !== shift_id);
      } catch (error) {
        console.error(error);
      }
    },

    async updateShift(shift_id: number, updatedFields: Partial<Shift>) {
      try {
        const API_URL = `http://localhost:5001/api/shifts/${shift_id}`
        const res = await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });
        if (!res.ok) throw new Error("Failed to update shift");
        const data = await res.json();
        const index = this.shifts.findIndex(s => s.shift_id === shift_id);
        if (index !== -1) this.shifts[index] = data;
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async startShift(shift_id: number) {
      try {
        const authStore = useAuthStore();
        console.log("Starting shift with ID:", shift_id);
        const res = await fetch(`http://localhost:5001/api/shifts/${shift_id}/start`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`
           },
           // if you use cookies; remove if not needed
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to start shift: ${res.status} ${text}`);
        }
        const updated = await res.json();
        // update store
        this.shifts = this.shifts.map(s => (s.shift_id === updated.shift_id ? updated : s));
        return updated;
      } catch (err) {
        console.error("startShift error:", err);
        throw err;
      }
    },

    // End a shift (calls backend route PATCH /api/shifts/:id/end)
    async endShift(shift_id: number) {
      try {
        const authStore = useAuthStore();
        const res = await fetch(`http://localhost:5001/api/shifts/${shift_id}/end`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`
           },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to end shift: ${res.status} ${text}`);
        }
        const updated = await res.json();
        // update store
        this.shifts = this.shifts.map(s => (s.shift_id === updated.shift_id ? updated : s));
        return updated;
      } catch (err) {
        console.error("endShift error:", err);
        throw err;
      }
    },

    // refresh only shifts for a given user (helpful after create/start/end)
    async refreshShiftsForUser(company_id: number, user_id: number) {
      // Fetch company shifts then filter client-side
      await this.fetchCompanyShifts(company_id);
      return this.shifts.filter(s => s.user_id === user_id);
    },

    async approveShift(shift_id: number, approved_by: number) {
  try {
    const res = await fetch(`http://localhost:5001/api/shifts/${shift_id}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved_by }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to approve shift: ${res.status} ${text}`);
    }

    const updated = await res.json();
    this.shifts = this.shifts.map(s =>
      s.shift_id === updated.shift_id ? updated : s
    );
    return updated;
  } catch (err) {
    console.error("approveShift error:", err);
    throw err;
  }
}
  }
});

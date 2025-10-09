import { defineStore } from "pinia";

interface Availability {
  availability_id: number;
  user_id: number;
  date: string;
  status: "available" | "unavailable";
  note?: string;
}

export const useAvailabilityStore = defineStore("availability", {
  state: () => ({
    availability: [] as any[],
    loading: false,
    availabilityMap: {} as Record<string, "available" | "unavailable">,
  }),

  getters: {
    availabilityMap: (state) => {
      const map: Record<string, string> = {};
      state.availability.forEach((a) => {
        const dateKey = new Date(a.date).toISOString().split("T")[0];
        map[dateKey] = a.status;
      });
      return map;
    },
  },

  actions: {
    async fetchAvailability(user_id: number) {
  this.loading = true;
  try {
    const res = await fetch(`http://localhost:5001/api/availability/user/${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch availability");

    const fetchedData = await res.json();

   this.availability = fetchedData.map((a: Availability) => ({
          ...a,
          date: a.date.split("T")[0],
        }));

        // ✅ Zbuduj mapę dostępności
        const newMap: Record<string, "available" | "unavailable"> = {};
        for (const a of this.availability) {
          newMap[a.date] = a.status;
        }
        this.availabilityMap = newMap;
        console.log("Availability map keys:", Object.keys(this.availabilityMap));
  } catch (err) {
    console.error("❌ Failed to fetch availability:", err);
  } finally {
    this.loading = false;
  }
},

    async upsertAvailability(user_id: number, date: string, status: string, note?: string) {
      try {
        const API_URL = `http://localhost:5001/api/availability/upsert`;
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, date, status, note }),
        });
        if (!res.ok) throw new Error("Failed to save availability");

        const data = await res.json();

        // Update local state
        const existing = this.availability.find((a) => a.date.startsWith(date));
        if (existing) {
          existing.status = data.status;
          existing.note = data.note;
        } else {
          this.availability.push(data);
        }
      } catch (err) {
        console.error("❌ Failed to upsert availability:", err);
      }
    },

    async deleteAvailability(availability_id: number, date: string) {
      try {
        const API_URL = `http://localhost:5001/api/availability/${availability_id}`;
        const res = await fetch(API_URL, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete availability");
        this.availability = this.availability.filter(
          (a) => !a.date.startsWith(date)
        );
      } catch (err) {
        console.error("❌ Failed to delete availability:", err);
      }
    },
  },
});

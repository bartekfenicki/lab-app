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
    availability: [] as Availability[],
    loading: false,
    availabilityMap: {} as Record<string, "available" | "unavailable">, // For the logged-in user
    allAvailability: {} as Record<number, Record<string, "available" | "unavailable">>, // For all users in company
  }),

  actions: {
    /**
     * Fetch availability for a specific user
     * Used both for personal calendar and admin view
     */
    async fetchAvailability(user_id: number) {
      this.loading = true;
      try {
        const res = await fetch(`http://localhost:5001/api/availability/user/${user_id}`);
        if (!res.ok) throw new Error("Failed to fetch availability");

        const fetchedData = await res.json();

        // Normalize dates: strip time zone info for consistency
        const normalized = fetchedData.map((a: Availability) => ({
          ...a,
          date: a.date.split("T")[0], // e.g. "2025-10-16"
        }));

        // If the current user is fetching their own data → update main state
        this.availability = normalized;

        // Build map for quick lookup
        const map: Record<string, "available" | "unavailable"> = {};
        for (const a of normalized) {
          map[a.date] = a.status;
        }

        // Update current user's map
        this.availabilityMap = map;

        // Also store it in the multi-user collection
        this.allAvailability[user_id] = map;

        console.log(`✅ Availability fetched for user ${user_id}:`, Object.keys(map));
      } catch (err) {
        console.error("❌ Failed to fetch availability:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Upsert (insert/update) availability
     */
    async upsertAvailability(user_id: number, date: string, status: string, note?: string) {
      try {
        const res = await fetch(`http://localhost:5001/api/availability/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, date, status, note }),
        });
        if (!res.ok) throw new Error("Failed to save availability");

        const data = await res.json();

        // Update local state for the current user
        const existing = this.availability.find((a) => a.date === date);
        if (existing) {
          existing.status = data.status;
          existing.note = data.note;
        } else {
          this.availability.push(data);
        }

        // Update maps
        this.availabilityMap[date] = data.status;
        if (!this.allAvailability[user_id]) this.allAvailability[user_id] = {};
        this.allAvailability[user_id][date] = data.status;

        console.log(`✅ Upserted availability for ${date}: ${status}`);
      } catch (err) {
        console.error("❌ Failed to upsert availability:", err);
      }
    },

    /**
     * Delete availability
     */
    async deleteAvailability(availability_id: number, date: string, user_id?: number) {
      try {
        const res = await fetch(`http://localhost:5001/api/availability/${availability_id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete availability");

        // Update state
        this.availability = this.availability.filter((a) => a.date !== date);
        delete this.availabilityMap[date];
        if (user_id && this.allAvailability[user_id]) {
          delete this.allAvailability[user_id][date];
        }

        console.log(`🗑️ Deleted availability on ${date}`);
      } catch (err) {
        console.error("❌ Failed to delete availability:", err);
      }
    },
  },
});

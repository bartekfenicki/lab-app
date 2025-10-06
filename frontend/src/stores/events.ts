import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useEventsStore = defineStore("events", {
  state: () => ({
    events: [] as any[],
    loading: false,
    error: null as string | null,
    _fetched: false,
  }),
  actions: {
    async fetchCompanyEvents(force = false) {
      
      // Prevent multiple identical fetches
      if (!force && this._fetched) {
        console.debug("fetchCompanyEvents: already fetched, skipping");
        return this.events;
      }
      // Prevent concurrent double-fetches
      if (this.loading) {
        console.debug("fetchCompanyEvents: already loading, skipping");
        return this.events;
      }

      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      try {
        const res = await fetch("http://localhost:5001/api/events", {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to fetch events");
        }
        this.events = await res.json();

        // debug-print concise info so you can inspect assigned_users quickly
        console.log('store.fetchCompanyEvents -> raw events from network:', this.events.map((e:any)=>({
        id: e.event_id,
        assigned_type: typeof e.assigned_users,
        assigned_len: Array.isArray(e.assigned_users) ? e.assigned_users.length : null,
      })));

        this._fetched = true;
        return this.events;
      } catch (err: any) {
        this.error = err.message || "Unknown error";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createEvent(formData: FormData) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      try {
        const res = await fetch("http://localhost:5001/api/events", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create event");
        }
        const newEvent = await res.json();
        this.events.push(newEvent);
        return newEvent;
      } catch (err: any) {
        this.error = err.message || "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});

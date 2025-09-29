import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

interface NewsReaction {
  reaction_id?: number;
  news_id: number;
  user_id: number;
  user_name?: string; // optional if you join with users table later
}

interface NewsState {
  posts: any[];
  likes: Record<number, NewsReaction[]>; // news_id -> list of reactions
  userLikes: Set<number>; // track which posts the logged-in user liked
}

export const useNewsStore = defineStore("news", {
  state: () => ({
    posts: [] as any[],
    likes: {} as Record<number, NewsReaction[]>,
    userLikes: new Set(),
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPostsByCompany(companyId: number) {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = `http://localhost:5001/api/news/company/${companyId}`;
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch news posts");
        this.posts = await res.json();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

   async createPost(payload: { title: string; description: string; image: File | string | null }) {
  const authStore = useAuthStore();
  if (!authStore.user) throw new Error("Not logged in");

  try {
    const API_URL = `http://localhost:5001/api/news`;
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);

    if (payload.image instanceof File) {
      formData.append("image", payload.image); // ✅ must match backend
    } else if (typeof payload.image === "string") {
      formData.append("image", payload.image); // fallback if URL
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
       Authorization: `Bearer ${authStore.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create post");
    }

    const newPost = await res.json();
    this.posts.unshift(newPost);
  } catch (err: any) {
    this.error = err.message;
  }
},



    async deletePost(id: number) {
      if (!confirm("Are you sure you want to delete this post?")) return;
      try {
        const res = await fetch(`http://localhost:5001/api/news/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete post");
        this.posts = this.posts.filter(p => p.news_id !== id);
      } catch (err: any) {
        alert(err.message);
      }
    },

    async fetchLikes(news_id: number) {
      const res = await fetch(`http://localhost:5001/api/newsreaction/${news_id}`);
      if (!res.ok) throw new Error("Failed to fetch likes");
      const data: NewsReaction[] = await res.json();
      this.likes[news_id] = data;
    },

    async toggleLike(news_id: number, user_id: number) {
      if (this.userLikes.has(news_id)) {
        // Unlike
        await fetch(`http://localhost:5001/api/newsreaction/${news_id}/${user_id}`, {
          method: "DELETE",
        });
        this.userLikes.delete(news_id);
        this.likes[news_id] = this.likes[news_id]?.filter(r => r.user_id !== user_id) || [];
      } else {
        // Like
        const res = await fetch(`http://localhost:5001/api/newsreaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ news_id, user_id }),
        });
        if (!res.ok) throw new Error("Failed to like post");
        const data: NewsReaction = await res.json();
        this.userLikes.add(news_id);
        if (!this.likes[news_id]) this.likes[news_id] = [];
        this.likes[news_id].push(data);
      }
    },

    hasUserLiked(news_id: number) {
      return this.userLikes.has(news_id);
    },
  },
});

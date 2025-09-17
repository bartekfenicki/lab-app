import { pool } from "../config/db.js";

export interface NewsPost {
  news_id: number;
  created_by: number;
  title: string;
  description: string;
  image: string;
  created_at?: Date;
}

// ✅ Create a news post
export const createNewsPost = async (news: Omit<NewsPost, "news_id" | "created_at">): Promise<NewsPost> => {
  const result = await pool.query(
    `INSERT INTO newspost (created_by, title, description, image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [news.created_by, news.title, news.description, news.image]
  );
  return result.rows[0];
};

// ✅ Get all news posts
export const getAllNewsPosts = async (): Promise<NewsPost[]> => {
  const result = await pool.query(`SELECT * FROM newspost ORDER BY created_at DESC`);
  return result.rows;
};

// ✅ Get single news post by ID
export const getNewsPostById = async (id: number): Promise<NewsPost | null> => {
  const result = await pool.query(`SELECT * FROM newspost WHERE news_id = $1`, [id]);
  return result.rows[0] || null;
};

// ✅ Update a news post
export const updateNewsPost = async (
  id: number,
  news: Partial<Omit<NewsPost, "news_id" | "created_at">>
): Promise<NewsPost | null> => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const key in news) {
    fields.push(`${key} = $${i}`);
    values.push((news as any)[key]);
    i++;
  }

  if (fields.length === 0) return null;

  values.push(id);

  const result = await pool.query(
    `UPDATE newspost SET ${fields.join(", ")} WHERE news_id = $${i} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

// ✅ Delete a news post
export const deleteNewsPost = async (id: number): Promise<boolean> => {
  const result = await pool.query(`DELETE FROM newspost WHERE news_id = $1`, [id]);
  return result.rowCount! > 0;
};

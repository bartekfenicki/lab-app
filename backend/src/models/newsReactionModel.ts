import { pool } from "../config/db.js";

export interface NewsReaction {
  reaction_id?: number;  
  news_id: number;
  user_id: number;
}

// ✅ Add a like
export const createReaction = async (reaction: NewsReaction): Promise<NewsReaction> => {
  const result = await pool.query(
    "INSERT INTO newsreaction (news_id, user_id) VALUES ($1, $2) RETURNING *",
    [reaction.news_id, reaction.user_id]
  );
  return result.rows[0];
};

// ✅ Remove a like
export const deleteReaction = async (news_id: number, user_id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM newsreaction WHERE news_id = $1 AND user_id = $2",
    [news_id, user_id]
  );
  return result.rowCount! > 0;
};

// ✅ Get all likes for a post
export const getReactionsForPost = async (news_id: number): Promise<(NewsReaction & { user_name: string })[]> => {
  const result = await pool.query(
    `
    SELECT nr.reaction_id, nr.news_id, nr.user_id,
           u.first_name || ' ' || u.last_name AS user_name
    FROM newsreaction nr
    JOIN users u ON u.user_id = nr.user_id
    WHERE nr.news_id = $1
    `,
    [news_id]
  );

  return result.rows;
};


// ✅ Check if a user liked a post
export const hasUserLiked = async (news_id: number, user_id: number): Promise<boolean> => {
  const result = await pool.query(
    "SELECT 1 FROM newsreaction WHERE news_id = $1 AND user_id = $2",
    [news_id, user_id]
  );
  return result.rowCount! > 0;
};
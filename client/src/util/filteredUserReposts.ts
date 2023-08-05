import { Post, Repost, ItemType } from "../types/types";

export function filteredUserReposts(postsAndReposts: (Post | Repost)[]): Repost[] {
  const userReposts = postsAndReposts.filter(
    (item) => item.type === ItemType.Repost
  ) as Repost[];

  return userReposts;
}
 
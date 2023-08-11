import { Repost } from "../types/types";

export function repostChecker( userReposts: Repost[], postId: string, authenticatedUserId: string): boolean {
    const isReposted = userReposts.some(
        (repost) =>
          repost.post._id === postId &&
          repost.repost_creator._id === authenticatedUserId
      );

    return isReposted
}
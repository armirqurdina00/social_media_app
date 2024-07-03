"use client"

import Post from "./Post";

export default function PostsList({posts}) {
  return (
    <div>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  )
}
"use client"

import PostsList from "./PostsList"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "../TokenContext";
import { backendHost } from '../constants'

async function getPosts(token) {
  const res = await fetch(`${backendHost}/posts`, {
    headers: { Authorization: token },
    next: {
      revalidate: 0
    }
  })

  return res.json()
}

export default function Main() {
  const { token } = useToken();
  const router = useRouter();

  if (!token) router.push('/login')

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPosts(token)
        setPosts(posts)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    setLoading(false)
  }, [])

  return (
    <div className="w-[90%] sm:[400px] md:w-[600px] mx-auto">
      <h1 className="text-xl text-center mt-4">Home</h1>
      {loading && <div className="text-center">Loading...</div>}
      <PostsList posts={posts} />
    </div>
  )
}
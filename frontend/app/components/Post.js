"use client"

import { useState } from "react"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import { jwtDecode } from 'jwt-decode';
import { useToken } from "../TokenContext";
import Image from "next/image";


export default function Post({ post }) {

  const [comments, setComments] = useState([])
  const [addComment, setAddComment] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  let decodedData = {}

  const { token } = useToken();
  if (token) decodedData = jwtDecode(token);

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  async function postComment(id) {
    const res = await fetch('http://localhost:3001/add-comment', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'post_id': post.id,
        'content': comment
      }),
    })
    if (res.ok) {
      let newComment = { post_id: id, content: comment, User: { username: decodedData.user.username } }
      let newComments = comments.slice();
      newComments.push(newComment)
      setComments(newComments)
      post.Comments.length++;
      setComment('')
      setShowComments(true)
      setAddComment(false)
    }
  }


  async function getComments(id) {
    if (!showComments) {
      const res = await fetch(`http://localhost:3001/posts/${id}/comments`, {
        headers: { Authorization: token },
        next: {
          revalidate: 0
        }
      }).then(response => response.json()).then(data => {
        setComments(data)
        setShowComments(!showComments)
      })
    }
    else {
      setShowComments(!showComments)
    }
    }

  return (
    <div className="bg-gray-100 rounded-xl border border-gray-300 shadow-xl overflow-hidden bg-gray-100 p-6 my-4">
      <div className="">
        <div className="flex">
          <AccountCircleIcon />
          <div className="font-bold mb-2 underline mx-2">{post.User.username}</div>
        </div>
        <div className="mb-2 h-max overflow-hidden">{post.content}</div>
        {/* {!readMore && <div className="text-gray-400 font-light cursor-pointer hover:underline hover:text-black text-xs w-max" onClick={() => setReadMore(!readMore)}>Read more...</div>} */}
      </div>
      {post.image && (
        <div className="flex justify-center mt-4">
          <Image className="w-full rounded-xl" src={`/${post.image}`} width={500} height={500} alt="img" />
        </div>
      )}
      <div className="flex justify-between mt-4">
        <div className="text-sm">{post.likes} likes</div>
        <div onClick={() => getComments(post.id)} className="text-sm cursor-pointer hover:underline">
          {post.Comments.length > 1 && <div>{post.Comments.length} comments </div>}
          {post.Comments.length == 0 && <div>{post.Comments.length} comments </div>}
          {post.Comments.length == 1 && <div>{post.Comments.length} comment </div>}
        </div>
      </div>
      <div className="flex justify-between mt-4 items-center">
        <div className=""><span className="mx-1"><ThumbUpIcon /></span>Like</div>
        <div className="cursor-pointer" onClick={() => setAddComment(!addComment)}><span className="mx-1"><CommentIcon /></span>Comment</div>
        <div className=""><span className="mx-1"><ShareIcon /></span>Share</div>
      </div>
      {comments && showComments && comments.length > 0 && <hr className="mt-2 border-t border-t-gray-200"></hr>}
      {comments && showComments && comments.map((comment) => (
        <div className="mt-2" key={comment.id}>
          <div className="font-bold text-sm">{comment.User.username}</div>
          <div className="text-sm">{comment.content}</div>
        </div>
      ))}
      {addComment && (
        <div className="max-w-full mt-4 relative">
          <input className="w-[100%] p-2 px-3 rounded-xl sm:pr-[8%] pr-[10%] text-sm" type="text" placeholder="Add comment" value={comment} onChange={handleCommentChange} />
          <button
            className="sm:w-[8%] w-[10%] p-2 text-sm absolute right-0 rounded-tr-xl rounded-br-xl bg-black text-white"
            onClick={() => postComment(post.id)}>
            <SendIcon sx={{ fontSize: '18px' }} />
          </button>
        </div>
      )}
    </div>
  )
}
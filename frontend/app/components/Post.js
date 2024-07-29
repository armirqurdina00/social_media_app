"use client"

import { useEffect, useState } from "react"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import { jwtDecode } from 'jwt-decode';
import { useToken } from "../TokenContext";
import Image from "next/image";


export default function Post({ post }) {

  let decodedData = {}

  const { token } = useToken();
  if (token) decodedData = jwtDecode(token);

  const [comments, setComments] = useState([])
  const [addComment, setAddComment] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [likes, setLikes] = useState(false)
  const [postLiked, setPostLiked] = useState(false)

  const btnStyle = {
    padding: '5px 10px',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const iconStyle = {
    fontSize: '20px'
  }

  useEffect(() => {
    setLikes(post.Likes.length)
    setPostLiked(post.Likes.find(like => like.user_id === decodedData.user.id))
  }, [])

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

  const btnClassName = "bg-[#eee] border border-gray-300 sm:hover:bg-[#dde]"

  async function getComments(id) {
    if (!showComments && post.Comments.length > 0) {
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
    else if (post.Comments.length < 1) {
      return;
    }
    else {
      setShowComments(!showComments)
    }
  }

  async function handleLike(id) {
    if (postLiked) {
      const res = await fetch(`http://localhost:3001/like/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'post_id': id,
        }),
      })
      if (res.ok) {
        setPostLiked(false)
        let previousLikes = likes;
        setLikes(previousLikes - 1);
      }
    }
    else {
      const res = await fetch(`http://localhost:3001/like/add`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'post_id': id,
        }),
      })
      if (res.ok) {
        setPostLiked(true)
        let previousLikes = likes;
        setLikes(previousLikes + 1);
      }
    }
  }

  return (
    <div className="bg-gray-100 rounded-xl border border-gray-300 shadow-xl overflow-hidden bg-gray-100 p-6 my-4">
      <div className="">
        <div className="flex">
          <AccountCircleIcon />
          <div className="font-bold mb-2 mx-1">{post.User.username}</div>
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
        <div className="text-sm">{likes} {likes === 1 ? 'like' : 'likes'}</div>
        <div onClick={() => getComments(post.id)} className="text-sm cursor-pointer hover:underline">
          {post.Comments.length > 1 && <div>{post.Comments.length} comments </div>}
          {post.Comments.length == 0 && <div>{post.Comments.length} comments </div>}
          {post.Comments.length == 1 && <div>{post.Comments.length} comment </div>}
        </div>
      </div>
      <div className={`flex justify-between ${showComments ? 'my-4' : 'mt-4'} items-center`}>
        <div style={btnStyle} className={`cursor-pointer ${postLiked && 'text-blue-600'} text-sm sm:text-md w-[30%] ${btnClassName}`} onClick={() => handleLike(post.id)}><span className="mx-1"><ThumbUpIcon sx={iconStyle} /></span>Like</div>
        <div style={btnStyle} className={`cursor-pointer text-sm sm:text-md w-[35%] ${btnClassName}`} onClick={() => setAddComment(!addComment)}><span className="mx-1"><CommentIcon sx={iconStyle} /></span>Comment</div>
        <div style={btnStyle} className={`text-sm sm:text-md w-[30%] ${btnClassName}`}><span className="mx-1"><ShareIcon sx={iconStyle} /></span>Share</div>
      </div>
      {/* {comments && showComments && comments.length > 0 && <hr className="mt-2 border-t border-t-gray-300"></hr>} */}
      {comments && showComments && comments.map((comment) => (
        <div className="mt-2" key={comment.id}>
          <div className="font-bold text-sm">{comment.User.username}</div>
          <div className="text-sm">{comment.content}</div>
        </div>
      ))}
      {addComment && (
        <div className="max-w-full mt-4 relative">
          <input className="w-[100%] p-2 px-3 rounded-xl sm:pr-[8%] pr-[16%] text-sm border border-gray-400" type="text" placeholder="Add comment" value={comment} onChange={handleCommentChange} />
          <button
            className="sm:w-[8%] w-[14%] p-2 text-sm absolute right-0 rounded-tr-xl rounded-br-xl bg-black text-white border-[1px] border-black"
            onClick={() => postComment(post.id)}>
            <SendIcon sx={{ fontSize: '18px' }} />
          </button>
        </div>
      )}
    </div>
  )
}
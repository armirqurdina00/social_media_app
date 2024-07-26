"use client"

import { useEffect, useState } from "react"
import { backendHost } from '../constants'
import { useRouter } from "next/navigation"
import { useToken } from "../TokenContext"

export default function NewPostForm() {

    const [postFormData, setPostFormData] = useState({
        content: '',
        image: '',
    })

    const { token } = useToken();

    const router = useRouter();

    if (!token) router.push('/login')

    const inputStyle = "block p-2 w-full"

    async function handleSubmitPost() {
        if (postFormData.content === '' && postFormData.image === '') {
            alert('You must write something')
            return;
        }
        const formData = new FormData();
        
        formData.append('content', postFormData.content)
    
        if (postFormData.image !== '') {
            postFormData.image.forEach((image, index) => {
              formData.append('images', image); // Use the field name 'images'
            });
        }

        const res = await fetch(`${backendHost}/post/add`, {
            method: 'POST',
            headers: {
                Authorization: token,
            },
            body: formData
        })

        if (res.ok) {
            router.push('/')
        }
        else {
            console.log('error!!!')
        }
    }

    const handleContentChange = (event) => {
        let newData = { ...postFormData }
        newData['content'] = event.target.value
        setPostFormData(newData)
    }

    const handleImageChange = (event) => {
        let newData = { ...postFormData }
        const files = Array.from(event.target.files);
        newData['image'] = files
        setPostFormData(newData)
    }

    return (
        <div className="w-full ">
            <h1 className="text-xl text-center my-4">Add new post</h1>
            <textarea
                type="text"
                placeholder="What's new"
                name="content"
                value={postFormData.content}
                onChange={handleContentChange}
                className={inputStyle}
                rows="4"
                cols="50"
                required
            />
            <input
                type="file"
                name='image'
                onChange={handleImageChange}
                className='my-4'
            />
            <button className="w-full bg-black text-white p-2" onClick={handleSubmitPost}>Submit</button>
        </div>
    )
}
"use client"

export default function LoginForm({ username, setUsername, password, setPassword, loginUser }) {

  const inputStyle = "block p-2 my-2 w-full"

  const handleEnterPress = (e) => {
    if (e.key === "Enter") return loginUser()
}

  return (
    <>
      <div className="w-[300px]">
      <h1 className="text-xl text-center my-4">Login</h1>
      <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputStyle}
          onKeyDown={handleEnterPress}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputStyle}
          onKeyDown={handleEnterPress}
        />
        <button className="w-full bg-black text-white p-2" onClick={() => loginUser()}>Login</button>
      </div>
    </>
  )
}
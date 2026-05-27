"use client"

import { useAuth } from "@clerk/nextjs"

const UnauthorizedPage = () => {
    const {signOut}=useAuth();
  return (
    <div>
        <h1>You do not have an access!</h1>
        <button onClick={()=>signOut()}>Sign out</button>
    </div>
  )
}

export default UnauthorizedPage
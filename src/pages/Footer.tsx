import { useBackend } from "@/services/backendService"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

function Footer() {
    const backend = useBackend()
    
  
      if (!backend.session) {
        return (<><div>Logged out</div><button onClick={backend.loginWithGoogle}>LogIn</button></>)
      }
      else {
        return (<><div>Logged in as {backend.session.user.email}</div><button onClick={backend.logout}>log out</button></>)
      }
}


export default Footer
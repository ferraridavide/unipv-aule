import { useBackend } from "@/services/backendService"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

function Footer() {
    const backend = useBackend()
    const supabase = backend.getSupabase()
    const [session, setSession] = useState<Session | null>(null)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
  
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
  
        return () => subscription.unsubscribe()
      }, [])


      function login() {
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {redirectTo: 'https://ferraridavide.github.io/unipv-aule'}
        });
      }

      function logout() {
        supabase.auth.signOut();
      }

      async function invoke() {
        
        const { data, error } = await supabase.functions.invoke('report-aula', {
          body: {id: 1, open: true},
          headers: {
            "Authentication": "Bearer " + session!.access_token
          }
        })

        console.log(data, error);
      }
  
      if (!session) {
        return (<><div>Logged out</div><button onClick={login}>LogIn</button></>)
      }
      else {
        return (<><div>Logged in as {session.user.email}</div><button onClick={logout}>log out</button><button onClick={invoke}>Invoke</button></>)
      }
}


export default Footer
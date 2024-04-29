import { useToast } from '@/components/ui/use-toast';
import Aula from '@/models/aula';
import { findInterval, getAvailability } from '@/pages/Lucky'
import { Session, SupabaseClient, createClient } from '@supabase/supabase-js'
import { ReactNode, createContext, useContext, useEffect, useState, Suspense } from 'react'


// Create a singleton instance of the backend service
class BackendService {
    async reportAula(aula: Aula) {

        if (!this.session) {
            localStorage.setItem('pendingReport', JSON.stringify(aula));
            await this.client.auth.signInWithOAuth({
                provider: 'google',
              });
            return;
        } 
        await this.client.functions.invoke('report-aula', {
            body: aula,
            headers: {
              "Authentication": "Bearer " + this.session.access_token
            }
          })

        
        const interval = findInterval(aula.availability, new Date().getHours() * 60 + new Date().getMinutes())
        // this.toast({
        //     title: "Grazie per il tuo feedback! ☺️",
        //     description: `${aula.name} è stato segnalata come ${interval.isInInterval ? "non disponibile" : "disponibile"}.`,
        //   })
  
    }
    private static instance: BackendService | null = null
    private client: SupabaseClient // Replace 'any' with the appropriate type for your Supabase client
    public session: Session | null = null

    // public toast: any | null = null;

    // public setSession(session: Session | null) { 
    //     this.session = session;
    //     // if (!session) return;
    //     // const pendingReport = localStorage.getItem('pendingReport');
    //     // if (pendingReport) {
    //     //     const report = JSON.parse(pendingReport);
    //     //     this.reportAula(report);
    //     //     localStorage.removeItem('pendingReport');
    //     // }
    // }


    private constructor() {
        // Initialize the Supabase client
        this.client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
    }

    public static getInstance(): BackendService {
        if (!BackendService.instance) {
            BackendService.instance = new BackendService()
        }
        return BackendService.instance
    }

    private availableAule: any[] | null = null;
    public getAvailableAule(): any[] {
        return this.availableAule!;
    } 

    public async loadAvailableAule() {
        this.availableAule ??= (await this.client.from('available_aule').select('*')).data
        if (!this.availableAule) return;
            this.availableAule = this.availableAule.map((color, index) => {
                const interval = findInterval(color.availability, new Date().getHours() * 60 + new Date().getMinutes());
                return {
                  ...color,
                  interval: interval,
                  availability_text: getAvailability(interval)
                };
              });
            
              this.availableAule = this.availableAule.sort((a, b) => {
                if (a.interval.isInInterval === b.interval.isInInterval) {
                    if (b.interval.wait && a.interval.wait) {
                        if (a.interval.isInInterval){
                            return a.interval.wait - b.interval.wait;
                        } else {
                            return b.interval.wait - a.interval.wait;
                        }
                    } else if (a.interval.isInInterval){
                        return -1;
                    }
                }
                return a.interval.isInInterval ? 1 : -1;
              });
        return this.availableAule
    }

    public async loginWithGoogle() {
        await this.client.auth.signInWithOAuth({
            provider: 'google',
            options: {redirectTo: 'https://ferraridavide.github.io/unipv-aule'}
          })
    }

    public async logout() {
        await this.client.auth.signOut()
    }
    

    public getSupabase(): SupabaseClient{
        return this.client;
    }

    // Add your backend service methods here

}

// Create a context for the backend service
const BackendContext = createContext<BackendService | null>(null)

// Custom hook to access the backend service instance
export const useBackend = (): BackendService => {
    const backendService = useContext(BackendContext)
    if (!backendService) {
        throw new Error('useBackend must be used within a BackendProvider')
    }
    return backendService
}

interface BackendProviderProps {
    children: ReactNode;
  }

// Provider component to wrap your app and provide the backend service instance
export function BackendProvider ({ children } : BackendProviderProps) {
    const [availableAule, setAvailableAule] = useState<any[] | null>(null);
    // const {toast} = useToast();
    const backendService = BackendService.getInstance()
    // backendService.toast = (props: any) => toast({...props});
    useEffect(() => {
        backendService.getSupabase().auth.getSession().then(({ data: { session } }) => {
          backendService.session = session;
        })
  
        const {
          data: { subscription },
        } = backendService.getSupabase().auth.onAuthStateChange((_event, session) => {
            backendService.session = session;
        })
  
        return () => subscription.unsubscribe()
      }, [])

    useEffect(() => {
        const fetchAvailableAule = async () => {
            let aule = await backendService.loadAvailableAule()
            if (!aule) return;
            setAvailableAule(aule)
        };
        fetchAvailableAule();
    }, [])

    if (!availableAule) return <div>Loading...</div>

    

    return (
            <BackendContext.Provider value={backendService}>
                {children}
            </BackendContext.Provider>
    )
}

// Usage:
// Wrap your app with the BackendProvider component in your root component
// Then use the useBackend hook to access the backend service instance in your components
import { findInterval, getAvailability } from '@/pages/Lucky'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { ReactNode, createContext, useContext, useEffect, useState, Suspense } from 'react'


// Create a singleton instance of the backend service
class BackendService {
    private static instance: BackendService | null = null
    private client: SupabaseClient // Replace 'any' with the appropriate type for your Supabase client

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
    public async getAvailableAule() {
        this.availableAule ??= (await this.client.from('available_aule').select('*')).data
        return this.availableAule
    }

    // Add your backend service methods here

}

// Create a context for the backend service
const BackendContext = createContext<any[] | null>(null)

// Custom hook to access the backend service instance
export const useBackend = (): any[] => {
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
    const backendService = BackendService.getInstance()

    useEffect(() => {
        const fetchAvailableAule = async () => {
            let aule = await backendService.getAvailableAule()
            if (!aule) return;
            aule = aule.map((color, index) => {
                const interval = findInterval(color.availability, new Date().getHours() * 60 + new Date().getMinutes());
                return {
                  ...color,
                  interval: interval,
                  availability_text: getAvailability(interval)
                };
              });
            
              aule = aule.sort((a, b) => {
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
            setAvailableAule(aule)
        };
        fetchAvailableAule();
    }, [])

    if (!availableAule) return <div>Loading...</div>

    

    return (
            <BackendContext.Provider value={availableAule}>
                {children}
            </BackendContext.Provider>
    )
}

// Usage:
// Wrap your app with the BackendProvider component in your root component
// Then use the useBackend hook to access the backend service instance in your components
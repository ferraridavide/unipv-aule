import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import '../app/globals.css'


import FloatingNavbar from './FloatingNavbar'
import Lucky from './pages/Lucky'
import List from './pages/List'
import { ThemeProvider } from './services/themeProvider'
import { Toaster } from './components/ui/toaster'
import { BackendProvider } from './services/backendService'
import Footer from './pages/Footer'
import Contacts from './pages/Contacts'


function App() {

  const refs = {
    lucky: useRef(null),
    list: useRef(null),
    report: useRef(null),
  };


  


  return (
    <BackendProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">

        <main className="app-container">
          <FloatingNavbar refs={refs} />
          <section className="full-page" ref={refs.lucky}>
            <Lucky />
          </section>
          <section className="full-page" ref={refs.list}>
            <List />
          </section>
          <section className="full-page" ref={refs.report}>
            
            <div className="h-full flex justify-between flex-col items-center"><div>
            <Contacts/>
            <Footer/>

            </div><span>built with ❤️ by&nbsp;<a href="https://ferraridavide.github.io/" className="underline underline-offset-4">Davide Ferrari</a></span></div>
          </section>
        </main>
        <Toaster />
      </ThemeProvider>
    </BackendProvider>
  )
}

export default App

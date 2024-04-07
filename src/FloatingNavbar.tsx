import './FloatingNavbar.css'
import { Sun, Moon, SunMoon, Sparkles, TableProperties, MessageCircleWarning } from 'lucide-react'

import { useTheme } from './services/themeProvider';
import { useContext } from 'react';

function FloatingNavbar(props: any) {
  const theme = useTheme();

  const scrollIntoView = (ref: any) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <footer className="floating-navbar">
      <div className="nav-item" onClick={() => scrollIntoView(props.refs.lucky)}><Sparkles size={24}/></div>
      <div className="nav-item" onClick={() => scrollIntoView(props.refs.list)}><TableProperties size={24}/></div>
      <div className="nav-item" onClick={() => scrollIntoView(props.refs.report)}><MessageCircleWarning size={24}/></div>
      <div className="nav-separator"/>
      <div className="nav-item" onClick={() => theme.toggle()}>
        {theme.theme === "dark" ? <Moon size={24}/> : theme.theme === "light" ? <Sun size={25}/> : <SunMoon size={24}/>}
      </div>
    </footer>
  );
}


export default FloatingNavbar;
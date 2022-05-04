import { useEffect, useState } from 'react';
import './App.scss';
import Banner from './pages/banner';
import Intro from './pages/intro'


let timeout = null;

function App() {
  const [typed, setTyped] = useState(0);
  const [showEaster, setShowEaster] = useState(false);
  const name = "SHIKHAR";

  const handleShowEaster = () => {
    setShowEaster(true);
    if (timeout) {
      try {
        clearTimeout(timeout);
      } catch (e) {
        console.log(e);
      }
    }
    timeout = setTimeout(()=>{
      setShowEaster(false);
    }, 7000);
  }

  useEffect(() => {
    document.onkeyup = (e) => {
      console.log(e.code, `Key${name[typed]}`, typed);
      if (e.code === `Key${name[typed]}`) {
        setTyped(typed + 1);
        if (typed === name.length - 1) {
          handleShowEaster();
          setTyped(0);
        }
      } else {
        setTyped(0);
        console.log("fail", typed)
      }
    };
  }, [typed]);
  return (
    <div className="App">
      <Banner handleShowEaster={handleShowEaster}/>
      <Intro />

    </div>
  );
}

export default App;

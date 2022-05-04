import { useEffect, useState } from "react";

function Banner({handleShowEaster}) {
  const words = ["PRODUCTS", "SOLUTIONS", "TECHNOLOGIES"];
  const [highlightText, setHighlightText] = useState("");
  useEffect(() => {
    let word = 0;
    let letter = 0;
    let change = 1;
    const waitingCount = 7;
    let typer = true;
    let changeTyper = false;
    setInterval(() => {
      typer = changeTyper ? !typer : typer;
      changeTyper = !changeTyper;
      const setText = (text) => {
        setHighlightText(text + (typer ? "|" : ""));
      }
      if (letter === 0 && change === - 1) {
        word++;
        if (word >= words.length) {
          word = 0;
        }
        letter = 0;
        change = 1;
      } else if (letter < words[word].length) {
        letter = letter + change;
      } else if (letter < words[word].length + waitingCount) {
        letter = letter + change;
      } else {
        change = -1;
        letter = letter + change;
      }

      setText(words[word].substring(0, letter));
    }, 150);
  }, []);
  const abc=() => {
    console.log("called")
    handleShowEaster()
  }
  return (
    <div className="container banner">
      <span className="h text">
        <span className="ht1">WE</span><br/><span className="ht2">HELP</span><br/><span className="ht3">YOU BUILD</span><br/><span className="ht">{ highlightText || " " }</span>
      </span> 
    
      <span class="subtext">
         
      
      </span>
      
      <span className="h foottext">
      <button class="button-53" role="button">Let's Build your Project</button>
      </span>
      
    </div>
    
  )
}

export default Banner;
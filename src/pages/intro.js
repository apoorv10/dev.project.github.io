import { useEffect, useState } from "react";

function Intro() {
  return (
    <div className="container intro">
      <div class="text">
      <div class="h6"><i>Bringing your dreams to Reality!</i></div>
      <br/>
        <br/>
        <div class="h5">
          <b>Developed By:
          </b>
        </div>
        
        <div class="subtext">
          Apoorv Agrawal
          <p>Technology Expert/Architect/Developer</p><br/>
          <b>Experts:</b><br/>
          Shagun Arora
          <p>Technology Expert/Product Manger/Developer</p><br/>
          Shikhar Sahdev
          <p>Forntend Expert/UI-UX Designer/Developer</p><br/>
        </div>
      </div>
      
      <img src={process.env.PUBLIC_URL + ''} />
    </div>
  )
}

export default Intro;
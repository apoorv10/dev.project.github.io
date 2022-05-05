import { Component, useEffect, useState } from 'react';
import './App.scss';
import Banner from './pages/banner';
import {Routes,Route,Router , useLocation,
  useNavigate,
  useParams} from 'react-router-dom';
import { TransitionGroup,CSSTransition } from 'react-transition-group';
import Intro from './pages/intro'



let timeout = null;


// function withRouter(Component) {
//   function ComponentWithRouterProp(props) {
//     let location = useLocation();
//     let navigate = useNavigate();
//     let params = useParams();
//     return (
//       <Component
//         {...props}
//         router={{ location, navigate, params }}
//       />
//     );
//   }

//   return ComponentWithRouterProp;
// }
// class App extends Component{
//   constructor(props) {
//     super(props);
//     this.state = {
//       //Get initial depth of current page 
//       prevDepth: this.getPathDepth(this.props.location)
//     };
//   }

  
//   componentWillReceiveProps() {
//     //When props are updated, update the current path 
//     //props supplies us with the location object which has a router location info
//     this.setState({ prevDepth: this.getPathDepth(this.props.location) });
//   }

//   getPathDepth(location) {
//     let pathArr = location.pathname.split("/");
//     pathArr = pathArr.filter(n => n !== "");
//     return pathArr.length;
//   }


  
//   render() {
//     const { location } = this.props;
//   /*Used to track if the page path did change so when can re-render the routes to apply animation */
//     const currentKey = location.pathname.split("/")[1] || "/";
//     //Specify the duration of the animation (on enter and on exit)
//     const timeout = { enter: 800, exit: 400 };


//     return (
      
//       <TransitionGroup component="div" className="App">
//         <CSSTransition
//           key={currentKey}
//           timeout={timeout}
//           classNames="pageSlider"
//           mountOnEnter={false}
//           unmountOnExit={true}
//         >
//           <div
//           className={
//     this.getPathDepth(location) - this.state.prevDepth >= 0
//       ? "left"
//       : "right"
//   }>
            
//               <Routes>
//               <Route exact path='/' element={<Banner/>}></Route>
//               <Route exact path='/home'  element={<Banner/>} ></Route>
//               </Routes>
           
          
            
//           </div>
//         </CSSTransition>
//       </TransitionGroup>
//     );
//   }

// };

function App() {
  const [typed, setTyped] = useState(0);

 
  return (
    <div className="App">
      
      <Banner/>
      <Intro />

    </div>
  );
}
export default App;

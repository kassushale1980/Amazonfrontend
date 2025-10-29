import './App.css';
import {useContext,useEffect} from 'react'
import Routing from './Router.jsx'
import {DataContext} from './Components/DataProvider/DataProvider'
import {Type} from './Utility/action.type'
// import {auth} from './Utility/Firebase'
// App.js or any component
import { auth, db } from './Utility/Firebase';

// Example: check current user
console.log(auth.currentUser);




function App() {
const [{user},dispatch] = useContext(DataContext)

useEffect(()=>{
  auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      // console.log(authUser)
      dispatch({
        type: Type.SET_USER,
        user: authUser
      })
    }else{
      dispatch({
        type: Type.SET_USER,
        user: null
      })
    }
     }) 



},[])

 return (
   <Routing/>
    );
}

export default App;





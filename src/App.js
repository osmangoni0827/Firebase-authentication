import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';
import { useState } from 'react';

if(!firebase.apps.length){
firebase.initializeApp(firebaseConfig)
}
else{
  firebase.app()
}

function App() {
  const Googleprovider = new firebase.auth.GoogleAuthProvider();
  const Fbprovider = new firebase.auth.FacebookAuthProvider();
  const [user,setuser]=useState({
    isSignIn:false,
    name:'',
    email:'',
    photo:''
  });
  const [NewUser,SetNewUser]=useState(false);
const HandleSignIn=()=>{
  firebase.auth().signInWithPopup(Googleprovider).then((result)=>{
    const{email,photoURL,displayName}=result.user;
    setuser({
      isSignIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    })
    ?.catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode)
      var errorMessage = error.message;
      console.log(errorMessage)
      // The email of the user's account used.
      var email = error.email;
      console.log(email)
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(credential);
      // ...
    });

  })
}

const HandleSignInWithFb=()=>{
  firebase
  .auth()
  .signInWithPopup(Fbprovider)
  .then((result) => {
    const{email,photoURL,displayName}=result.user;
    setuser({
      isSignIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    })
    console.log(result.user)
  })
  .catch((error) => {
  console.log(error)
  });
}
const HandleSignOut=()=>{
  firebase.auth().signOut().then(()=>{

    const SignoutUser={
      isSignIn:false,
      name:'',
      email:'',
      photo:'',
      error:'',
      success:false
    }
    setuser(SignoutUser);

  })?.catch((error)=>{
    console.log(error);
  })
}

const HandleInput=(e)=>{

  let IsFormValid=true;
  if(e.target.name==='email'){
    IsFormValid=/\S+@\S+\.\S+/.test(e.target.value);
  }
  else if(e.target.name==='password'){
    const IsPasswordValid=e.target.value.length>6;
    const PasswordHasNumber=/\d{1}/.test(e.target.value);
    IsFormValid=IsPasswordValid&&PasswordHasNumber
  }

  if(IsFormValid){
    const NewUser={...user}
    NewUser[e.target.name]=e.target.value;
    setuser(NewUser);
  }
}

const HandleSubmit=(e)=>{
 
  if(NewUser&&user.email&&user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((res) => {
      // Signed in 
      const NewUser={...user};
      NewUser.success=true;
      setuser(NewUser);
      updateUserName(user.name)
    })
    .catch((error) => {
      const NewUser={...user};
      NewUser.error=error.message;
      NewUser.success=false;
      setuser(NewUser);
    });
  }
  else if(!NewUser&&user.email&&user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const NewUser={...user};
    NewUser.success=true;
    setuser(NewUser);
    console.log(res.user?.displayName)
  })
  .catch((error) => {
    const NewUser={...user};
      NewUser.error=error.message;
      NewUser.success=false;
      setuser(NewUser);
  });
  }

  const updateUserName=(name)=>{
    var user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: name
        }).then(function(res) {
          // Update successful.
          console.log('user update succesffully');
        }).catch(function(error) {
          // An error happened.
          console.log(error)
        });

  }
  e.preventDefault()
}

  return (
    <div className="App">
      <header>
        <h1>Firebase Authentication</h1>
      </header>

      {
        user.isSignIn?<button onClick={HandleSignOut} style={{fontSize:'30px'}}>Sign Out</button>:<button onClick={HandleSignIn} style={{fontSize:'30px'}}>Sign In</button>
      }<br></br>
      {
        user.isSignIn?<button style={{fontSize:'30px'}} onClick={HandleSignOut}>Sign Out </button>:<button style={{fontSize:'30px'}} onClick={HandleSignInWithFb}>Sign In with Facebook</button>
      }
      {
        user.isSignIn&&<div>
          <h1>Welcome to {user.name}</h1>
          <p>Your Email: {user.email}</p>
          <img style={{width:'100px'}} src={user.photo} alt=''></img>
        </div>
      }
      <br></br>
      <h1>Submit Form</h1>
      <form onSubmit={HandleSubmit}>
        <input type="checkbox"  onChange={()=>{
          SetNewUser(!NewUser);
        }}/>
        <label>New User Create</label>
        <br/>
          {
          NewUser && <input type='text' onBlur={HandleInput} name='name' placeholder='Enter Your Name' required/>
          }<br/>
          <input type='email' onBlur={HandleInput} name='email' placeholder="Enter Your Email" required></input><br></br>
          <input type='password' onBlur={HandleInput} name='password' placeholder="Enter Your Password" required></input><br></br>
          {
        NewUser?<input type='submit' value='Submit'></input>:<input type='submit' value='Log In'></input>
          }
          
      </form>
      {
        user.success?<p style={{color:'green'}}> User {NewUser?"Created":"Loged In"} Successfully</p>:<p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;

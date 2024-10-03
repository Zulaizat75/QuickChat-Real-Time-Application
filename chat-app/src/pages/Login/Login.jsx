import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'

const Login = () => {

  const [currState,setCurrState] = useState("Sign Up");

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign Up"? <input type="text" placeholder='username' className="form-input" required/> :null}
        <input type="email" placeholder='Email adress' className="form-input" required/>
        <input type="password" placeholder='password' className="form-input" required/>
        <button type='submit'>{currState === "Sign Up"?"Create Account":"Login Now"}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>I agree to the <span>terms of use & privacy policy.</span></p>
        </div>
        <div className="login-forgot">
          {
            currState === "Sign Up"
            ? <p className="login-toggle">Already have an account? <span onClick={()=> setCurrState("Login")}>Login Here</span></p>
            : <p className="login-toggle">Create an account <span onClick={()=> setCurrState("Sign Up")}> Click Here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login
import React from 'react'
import './Login.css'
import assets from '../../assets/assets'

const Login = () => {
  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>Sign Up</h2>
        <input type="text" placeholder='username' className="form-input" required/>
        <input type="email" placeholder='Email adress' className="form-input" required/>
        <input type="password" placeholder='password' className="form-input" required/>
        <button type='submit'>Sign Up</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>I agree to the <span>terms of use & privacy policy.</span></p>
        </div>
        <div className="login-forgot">
          <p className="login-toggle">Already have an account? <span>Click Here</span></p>
        </div>
      </form>
    </div>
  )
}

export default Login
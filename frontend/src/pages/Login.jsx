import axios from '../lib/axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Switch from '../components/Switch'
import { Link } from "react-router-dom";

const Login = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState({
        email,
        password
    })

    const navigate=useNavigate()

    useEffect(() => {
        
        const token=localStorage.getItem("userId")
        if(!token) return;
        
        const checkAuth = async () => {
            try {
                await axios.get("/user/check-auth")
                navigate("/chat", { replace: true });
            } catch (error) {
                console.log(error)
            }
        }
        checkAuth();
    }, [navigate]);

    
    const handlelogin=async(e)=>{
       e.preventDefault()
    
       try{
       const res=await axios.post("/user/login",{
        email,
        password,
       })
          
        if (res.data.success) {

      localStorage.setItem("userId", res.data.user.id)
      localStorage.setItem("username", res.data.user.username)
        }
        
       navigate('/chat', {replace:true })
    }
    catch(error){
        console.log(error)
    }
}

    const emailhandle=(e)=>{
        const val=e.target.value
        setEmail(val)

        setError((prev)=>({
            ...prev,
            email:!val.trim()?"Please enter the email":""
        }))
    }
  
     const passwordhandle=(e)=>{
        const val=e.target.value
        setPassword(val)

        setError((prev)=>({
            ...prev,
            password:!val.trim()?"Please enter the password":""
        }))
    }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><div className="auth-mark"><span /><span /><span /></div><span>ChatUI</span></div>
        <header className="auth-heading"><p>Welcome back</p><h1>Sign in to your conversations</h1></header>
      <form onSubmit={handlelogin} className="auth-form">
        <label>Email address
        <input 
          type='email' 
          placeholder='you@example.com' 
          onChange={emailhandle}
        />
        </label><p className="form-error">{error.email}</p>
        <label>Password
        <input 
          type='password' 
          placeholder='Enter your password' 
          onChange={passwordhandle}
        />
        </label><p className="form-error">{error.password}</p>
        <button 
          type='submit'
          className="auth-submit"
        >
          Login
        </button>
      </form>
     <div className="auth-link-row">
  <Link to="/forgot-password">
    Forgot Password?
  </Link>
</div>
      <Switch type="login" />
      </section>
    </main>
  )
}

export default Login

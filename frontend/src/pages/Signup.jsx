import axios from '../lib/axios'
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Switch from '../components/Switch'

const Signup = () => {
        const [name,setName]=useState("")
        const [username,setUserName]=useState('')
        const [email,setEmail]=useState('')
        const [password,setPassword]=useState('')
        const [error,setError]=useState({
            name:"",
            username:"",
            email:'',
            password:"",
            allfield:""
        })

        const navigate=useNavigate()
    
        useEffect(() => {
            const checkAuth = async () => {
                try {
                    await axios.get("/user/check-auth")
                    navigate("/chat", { replace: true });
                } catch {
                    // Not authenticated, stay on signup page
                }
            }
            checkAuth();
        }, [navigate]);

    const handle= async(e)=>{
          e.preventDefault()

          // check all fields on direct submit
          if (!name||!username||!email||!password) {
            setError((prev) => ({
              ...prev,
              allfield: "Please enter all fields"
            }))
            return
          }
          else{
            setError((prev)=>({...prev,allfield:""}))
          }
          
          // clear the allfield error if fields are filled
          setError((prev) => ({
            ...prev,
            allfield: ""
          })) 

            try{
            const res=await axios.post("/user/signup",{
                name,
                username,
                email,
                password
            })
              
             if (res.data.success) {
      localStorage.setItem("userId", res.data.user.id)
      localStorage.setItem("username", res.data.user.username)
             }
            alert("Signup Successful")

            setTimeout(()=>{
                navigate('/chat', {replace:true })
            },1500)



        } catch (error) {
            console.log(error)
        }
    }
    const namehandle=(e)=>{
       const val=e.target.value
        setName(val)

        //this updates only the name error without removing other errors
        setError((prev)=>({
            ...prev,
            name:!val.trim()?"Please enter the name":""
        }))
    }

    const usernamehandle=(e)=>{
        const val=e.target.value
        setUserName(val.toLowerCase())

        setError((prev)=>({
            ...prev,
            username:!val.trim()?"Please enter a username":""
        }))
    }

    const emailhandle=(e)=>{
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const val=e.target.value
        setEmail(val.toLowerCase())
        
        setError((prev)=>({
            ...prev,
            email:!val.trim()?"Please enter the email":!regex.test(val)?"Please enter valid email":""
        }))
    } 
   
    const passwordhandle=(e)=>{
        const val=e.target.value
        setPassword(val)

        setError((prev)=>({
            ...prev,
            password:!val.trim()?"Please enter a password":val.length<6?"Password minimum length is 6":""
        }))
    }
    
  return (
    <main className="auth-page">
      <section className="auth-card auth-card--signup">
        <div className="auth-brand"><div className="auth-mark"><span /><span /><span /></div><span>ChatUI</span></div>
        <header className="auth-heading"><p>Start a new chapter</p><h1>Create your account</h1></header>
        <p className="form-error form-error--center">{error.allfield}</p>
        <form className="auth-form" onSubmit={handle}>
        <label>Full name<input type='text' placeholder='Your name' onChange={namehandle}/></label><p className="form-error">{error.name}</p>
        <label>Username<input type='text' placeholder='Choose a username' onChange={usernamehandle}/></label><p className="form-error">{error.username}</p>
        <label>Email address<input type='email' placeholder='you@example.com' onChange={emailhandle}/></label><p className="form-error">{error.email}</p>
        <label>Password<input type='password' placeholder='At least 6 characters' onChange={passwordhandle}/></label><p className="form-error">{error.password}</p>
      <button className="auth-submit" type='submit'>Create account</button>
        </form>
        <Switch type="signup"/>
      </section>
    </main>
  )
}

export default Signup

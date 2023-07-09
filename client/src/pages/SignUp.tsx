import { FC, useState, ChangeEvent, FormEvent } from 'react'
import { SignUpCredential } from '../types/types'

const SignUp: FC = () => {

    const [signUpCredentials, setSignUpCredentials] = useState<SignUpCredential>({
        username: "",
        email: "",
        password: ""
    })

    function handleOnChange(e: ChangeEvent<HTMLInputElement>){
        const { name, value } = e.target
        setSignUpCredentials(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    async function handleSignUp(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/users/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpCredentials)
            })
            const data = await response.json()
            localStorage.setItem("token", data.token)
        } catch (error) {
            console.error
        }finally{
            console.log("success")
        }
    }

    

return (
    <div className='h-[100vh] flex items-center justify-center'>
        <form className='flex items-center justify-center flex-col auto gap-4 border border-slate-600 p-5' onSubmit={handleSignUp}>
            <label htmlFor="username">Username</label>
            <input name="username" type="text" id='username' className='border'onChange={handleOnChange} />

            <label htmlFor="email">Email</label>
            <input name="email" type="email" id='email' className='border'onChange={handleOnChange} />

            <label htmlFor="password">Password</label>
            <input name="password" type="password" id='password' className='border' onChange={handleOnChange} />

            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default SignUp
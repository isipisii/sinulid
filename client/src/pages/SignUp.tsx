import { FC, useState, ChangeEvent, FormEvent } from 'react'
import { SignUpCredential } from '../types/types'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignUp: FC = () => {
    const navigate = useNavigate()
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
            if(response.ok){
                const data = await response.json()
                localStorage.setItem("token", data.token)
                navigate("/")
            }
        } catch (error) {
            console.error
        }
    }

    const signUpFields = [
        {
            inputName: "username",
            placeholder:"Username",
            inputType: "text"
        },
        {
            inputName: "email",
            placeholder: "Email",
            inputType: "email"
        },
        {
            inputName: "password",
            placeholder: "Password",
            inputType: "password",
        },
        {
            inputName: "password",
            placeholder: "Confirm password",
            inputType: "password",
        }
    ]

return (
    <div className='h-[100vh] flex items-center justify-center bg-matteBlack'>
        <form className='flex items-center justify-center flex-col gap-6 border border-slate-600 p-5 rounded-md w-[400px]' onSubmit={handleSignUp}>
            <h1 className='text-white font-semibold text-[1.5rem] self-start'>Join Sinulid today</h1>
            <div className='flex items-center justify-center flex-col gap-3 w-full'>
            {signUpFields.map((field, index) => (
                <input name={field.inputName} onFocus={e => e.target.style.borderColor = '#ffffff81'} type={field.inputType} placeholder={field.placeholder} className='focus:border-[#ffffff81] text-sm border border-[#d3d3d354] text-white rounded-sm bg-[transparent] w-full p-2' onChange={handleOnChange} key={index}/>
            ))}
            </div>  
            <button type='submit' className='bg-cta w-full p-2 rounded-sm text-matteBlack font-bold text-sm'>Sign Up</button>
            <p className='text-lightText text-xs'>Got an account?  <Link to="/login" className='text-cta'>Log in</Link></p>
        </form>
    </div>
)}

export default SignUp
import { FC, useState, ChangeEvent, FormEvent } from 'react'
import { SignUpCredentials } from '../types/types'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../features/app/hooks'
import { setToken } from '../features/auth/authSlice'
import { signUpFields } from '../constants'
import { useSignUpMutation } from '../services/authApi'

const SignUp: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [signUp] = useSignUpMutation()
    const [signUpCredentials, setSignUpCredentials] = useState<SignUpCredentials>({
        username: "",
        email: "",
        password: "",
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
            const payload = await signUp(signUpCredentials).unwrap()  
            if(payload){
                localStorage.setItem("token", payload.token)
                dispatch(setToken(payload.token))
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

return (
    <div className='h-[100vh] flex items-center justify-center bg-matteBlack'>
        <form className='flex items-center justify-center flex-col gap-6 border border-slate-600 p-5 rounded-md w-[400px]' onSubmit={handleSignUp}>
            <h1 className='text-white font-semibold text-[1.5rem] self-start'>Join Sinulid today</h1>
            <div className='flex items-center justify-center flex-col gap-3 w-full'>
            {signUpFields.map((field, index) => (
                <input name={field.inputName} type={field.inputType} placeholder={field.placeholder} className='focus:border-[#ffffff81] text-sm border border-[#d3d3d354] text-white rounded-sm bg-[transparent] w-full p-2' onChange={handleOnChange} key={index}/>
            ))}
            </div>  
            <button type='submit' className='bg-cta w-full p-2 rounded-sm text-matteBlack font-bold text-sm'>Sign Up</button>
            <p className='text-lightText text-xs'>Got an account?  <Link to="/login" className='text-cta'>Log in</Link></p>
        </form>
    </div>
)}

export default SignUp
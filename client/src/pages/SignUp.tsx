import { FC } from 'react'
import { SignUpCredentials } from '../types/types'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../features/app/hooks'
import { setToken } from '../features/auth/authSlice'
import { useSignUpMutation } from '../services/authApi'
import { useForm } from 'react-hook-form';


const SignUp: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [signUp] = useSignUpMutation()
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<SignUpCredentials>()
    const errorStyle = "text-red-500 text-[.7rem]"

    async function handleSignUp(signUpCredentials: SignUpCredentials): Promise<void> {
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
        {/* <form className='flex items-center justify-center flex-col gap-6 border border-slate-600 p-5 rounded-md w-[400px]' onSubmit={handleSignUp}> */}
        <form className='flex items-center justify-center flex-col gap-6 border border-borderColor p-5 rounded-md w-[400px]' onSubmit={handleSubmit(handleSignUp)}>
            <h1 className='text-white font-semibold text-[1.5rem] self-start'>Join Sinulid today</h1>
            <div className='flex justify-center flex-col gap-3 w-full'>
            {/* username */}
            <input
                placeholder='Username'
                className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
                focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.username ? "border-red-500 focus:ring-red-500" : null}`}
                {...register("username", {required: true, maxLength: 15})}
            />
            {errors.username && errors.username.type === "required"  && (<p className={errorStyle}>Username is required</p>)}
            {errors.username && errors.username.type === "maxLength"  && (<p className={errorStyle}>Username should not exceed to 15 characters</p>)}
            
            {/* email */}
            <input 
                placeholder='Email'
                type='email'
                className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
                focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.email ? "border-red-500 focus:ring-red-500" : null}`}
                {...register("email", {required: true})}
            />
            {errors.email && errors.email.type === "required"  && (<p className={errorStyle}>Email is required</p>)}

            {/* password */}
            <input 
                placeholder='Password'
                type='password'
                className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
                focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.password ? "border-red-500 focus:ring-red-500" : null}`}
                {...register("password", {required: true, minLength: 8})}
            />
            {errors.password && errors.password.type === "required"  && (<p className={errorStyle}>Password is required</p>)}
            {errors.password && errors.password.type === "minLength"  && (<p className={errorStyle}>Password should be more than 8 characters</p>)}

            {/* confirm password */}
            <input 
                placeholder='Confirm password'
                type='password'
                className={`placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 shadow-sm 
                focus:outline-none focus:border-none focus:ring-cta focus:ring-1 sm:text-sm bg-transparent ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : null}`}
                {...register("confirmPassword", {
                    required: true,
                    validate: {
                        matchPassword: (value) => {
                            const { password } = getValues()
                            return password === value || "Password didn't match";
                        }
                    },
                })}
            />
            {errors.confirmPassword && errors.confirmPassword.type === "required"  && (<p className={errorStyle}>Confirm password is required</p>)}
            {errors.confirmPassword  && (<p className={errorStyle}>{errors.confirmPassword.message}</p>)}

            {/* {signUpFields.map((field, index) => (
                <input name={field.inputName} type={field.inputType} placeholder={field.placeholder} className='focus:border-[#ffffff81] text-sm border border-[#d3d3d354] text-white rounded-sm bg-[transparent] w-full p-2' onChange={handleOnChange} key={index}/>
            ))} */}
            </div>  
            <button type='submit' className='bg-cta w-full p-2 rounded-sm text-matteBlack font-bold text-sm'>Sign Up</button>
            <p className='text-lightText text-xs'>Got an account?  <Link to="/login" className='text-cta'>Log in</Link></p>
        </form>
    </div>
)}

export default SignUp
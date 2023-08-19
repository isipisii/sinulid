import { JSX, useState } from 'react'
import { SignUpCredentials } from '../../types/types'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../features/app/hooks'
import { setToken } from '../../features/auth/authSlice'
import { useSignUpMutation } from '../../services/authAndUserApi'
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Toaster } from 'react-hot-toast'
import { showToast } from '../../util/showToast'
import Spinner from '../../components/loader/Spinner'

const SignUpForm = (): JSX.Element => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [signUp, { isLoading: isSigningUp }] = useSignUpMutation()
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<SignUpCredentials>()

    const errorStyle = "text-red-500 text-[.7rem] mt-[-.5rem]"
    const inputFieldStyle = "placeholder:text-[#726e6e] text-white block w-full border border-borderColor rounded-sm p-2 pr-10 shadow-sm focus:outline-none focus:border-non focus:ring-1 sm:text-sm bg-transparent"

    async function handleSignUp(signUpCredentials: SignUpCredentials): Promise<void> {
        try {
            const payload = await signUp(signUpCredentials).unwrap()  
            if(payload){
                localStorage.setItem("token", payload.token)
                dispatch(setToken(payload.token))
                navigate("/")
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.status === 409){
                showToast("This username is already taken, please use different one.", true)
            } else {
                console.error(error)
                showToast("Error, something went wrong.", true);
            }
        }
    }

  return (
    <>
        <form className='flex items-center justify-center flex-col gap-6 border  bg-matteBlack border-borderColor p-5 rounded-md w-[400px] mx-4' onSubmit={handleSubmit(handleSignUp)}>
          <h1 className='text-white font-semibold text-[1.5rem] self-start'><span className='font-light text-lightText'>Join</span> <span className='gradient'> Threads </span> <span className='font-light text-lightText'>today</span></h1>
          <div className='flex justify-center flex-col gap-3 w-full'>
              {/* name */}
              <input
                  placeholder='Name'
                  className={`${inputFieldStyle} ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
                  {...register("name", {required: true, maxLength: 30})}
              />
              {errors.name && errors.name.type === "required"  && (<p className={errorStyle}>Name is required</p>)}
              {errors.name && errors.name.type === "maxLength"  && (<p className={errorStyle}>Username should not exceed to 30 characters</p>)}

              {/* username */}
              <input
                  placeholder='Username'
                  className={`${inputFieldStyle} ${errors.username ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
                  {...register("username", {required: true, maxLength: 15})}
              />
              {errors.username && errors.username.type === "required"  && (<p className={errorStyle}>Username is required</p>)}
              {errors.username && errors.username.type === "maxLength"  && (<p className={errorStyle}>Username should not exceed to 15 characters</p>)}
              
              {/* email */}
              <input 
                  placeholder='Email'
                  type='email'
                  className={`${inputFieldStyle} ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
                  {...register("email", {required: true})}
              />
              {errors.email && errors.email.type === "required"  && (<p className={errorStyle}>Email is required</p>)}

              {/* password */}
              <div className='relative'>
                  <input 
                      placeholder='Password'
                      type={showPassword ? "text" : "password"}
                      className={`${inputFieldStyle} ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-white"}`}
                      {...register("password", {required: true, minLength: 8})}
                  />
                  {showPassword ?
                        <FiEye className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowPassword(false)}/> 
                            : 
                        <FiEyeOff className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowPassword(true)} />  
                  }
              </div>
              {errors.password && errors.password.type === "required"  && (<p className={errorStyle}>Password is required</p>)}
              {errors.password && errors.password.type === "minLength"  && (<p className={errorStyle}>Password should be more than 8 characters</p>)}

              {/* confirm password */}
              <div className='relative'>
                  <input 
                      placeholder='Confirm password'
                      type={showConfirmPassword ? "text" : "password"}
                      className={`${inputFieldStyle} ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-white "}`}
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
                   {showConfirmPassword ?
                        <FiEye className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowConfirmPassword(false)}/> 
                            : 
                        <FiEyeOff className="absolute top-0 bottom-0 right-3 my-auto text-lightText text-[1rem] cursor-pointer" onClick={() => setShowConfirmPassword(true)} />  
                    }
              </div>
              {errors.confirmPassword && errors.confirmPassword.type === "required"  && (<p className={errorStyle}>Confirm password is required</p>)}
              {errors.confirmPassword  && (<p className={errorStyle}>{errors.confirmPassword.message}</p>)}

          </div> 
          <button type='submit' className="bg-white hover:bg-[#e5e2e2bd]  ease-in-out duration-300 w-full p-2 rounded-sm text-matteBlack font-bold text-sm flex items-center justify-center">
              <div className="flex items-center gap-2">
                  {isSigningUp ? "Signing in" : "Sign in"}
                  {isSigningUp && <Spinner fillColor="fill-black" pathColor="text-gray-400" />}
              </div>
          </button>
          <p className='text-lightText text-xs'>Got an account?  <Link to="/login" className='text-white'>Log in</Link></p>
      </form>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  )
}

export default SignUpForm
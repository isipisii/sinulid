import { JSX } from 'react'
import SignUpForm from '../components/forms/SignUpForm'

const SignUp = (): JSX.Element => {

    return (
    <div className='h-[100vh] flex items-center justify-center bg-matteBlack bg-threads-bg bg-cover bg-center'>
        <SignUpForm />
    </div>
)}

export default SignUp
import { JSX} from "react";
import LogInForm from "../components/forms/LogInForm";

const LogIn = (): JSX.Element => {
  return (
    <div className='h-[100vh] flex items-center justify-center bg-matteBlack bg-threads-bg bg-cover bg-center'>
      <LogInForm />
    </div>
  );
};

export default LogIn;
 
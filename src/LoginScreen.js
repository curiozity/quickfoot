
import { useForm } from './hooks/useForm';

import { useDispatch } from 'react-redux';
// import { startGoogleLogin, startLoginEmailPassword } from './actions/auth';
import { startLoginEmailPassword } from './actions/auth';

function LoginScreen() {

    const dispatch = useDispatch();

    const [ formValues, handleInputChange] = useForm({
        email: 'miguel@gmail.com',
        password: 123456,
    })

    const { email, password } = formValues;

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch( startLoginEmailPassword( email, password ) );
    }

    // const handleGoogleLogin = () => {
    //     dispatch( startGoogleLogin() )
    // }

    return (
        <div>
            <h1>Login Screen</h1>
            <hr />
            <div className="login_form">
                <form onSubmit={ handleLogin }>
                    <input 
                        type="text"
                        placeholder="Email"
                        autoComplete="off"
                        name="email"
                        className="auth_input"
                        value={ email }
                        onChange={ handleInputChange }
                    />

                    <input 
                        type="password"
                        placeholder="Password"
                        name="password"
                        className="auth_input"
                        value={ password }
                        onChange={ handleInputChange }
                    />

                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
                {/* <button className="btn btn-secondary" onClick={ handleGoogleLogin }></button> */}
            </div>
        </div>
    )
}

export default LoginScreen

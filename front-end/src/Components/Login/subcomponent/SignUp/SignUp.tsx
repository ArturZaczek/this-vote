import { useState } from 'react';
import type { FormEvent } from 'react';

import style from './SignUp.module.scss'
import block from 'bem-css-modules'

import { useUserSignUpMutation } from '../../../../Redux/Services/UserApi';

const b = block(style)

const SignUp = () => {

    const [formObj, setFormObj] = useState({ email: "", password: "", secondPassword: "" })
    const [infoSingUpObj, setinfoSingUpObj] = useState<{ timeMessageSingUp: boolean, timeErrorSingUp: boolean, errorSingUp: string }>({ timeMessageSingUp: false, timeErrorSingUp: false, errorSingUp: '' })

    const [signUpApi, { data, isError: isErr, isSuccess }] = useUserSignUpMutation();

    const validatedEmail = (toVerified: string) => {
        const atCheck = toVerified.includes("@");
        const dotCheck = (toVerified.length / 2) < toVerified.lastIndexOf('.');
        return (atCheck && dotCheck)
    }

    const validatePassword = (toVerified: string) => {
        const regularExpression = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{4,16}$/;
        return (regularExpression.test(toVerified))
    }

    const handleChangeForm = (e: any) => {
        setFormObj(state => ({
            ...state, [e.target.name]: e.target.value,
        }))
    }

    const handleRegistry = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const signUpData = {
            email: formObj.email,
            password: formObj.password
        }

        if (validatedEmail(formObj.email) && validatePassword(formObj.password) && (formObj.password === formObj.secondPassword)) {
            signUpApi(signUpData)
                .unwrap()
                .then(() => {
                    setinfoSingUpObj(state => ({ ...state, timeMessageSingUp: true }))
                    setTimeout(() => { setinfoSingUpObj(state => ({ ...state, timeMessageSingUp: false })) }, 5000)
                })
                .catch((res) => {
                    console.log(res)
                    setinfoSingUpObj(state => ({ ...state, errorSingUp: res.data.message, timeErrorSingUp: true }))
                    setTimeout(() => { setinfoSingUpObj(state => ({ ...state, timeErrorSingUp: false })) }, 5000)
                })
            setFormObj(state => ({ ...state, email: '', password: '', secondPassword: '' }))
        } else {
            console.log('nie zarejestrowano')
        }
    }

    const signUpConditionError = () => {
        if (isErr && infoSingUpObj.timeErrorSingUp) {
            return true
        } else {
            return false
        }
    }
    const signUpConditionMessage = () => {
        if (isSuccess && infoSingUpObj.timeMessageSingUp) {
            return true
        } else {
            return false
        }
    }

    return (
        <section className={b()}>
            <h2 className={b('title')}>Sing up</h2>

            {signUpConditionMessage() && <h4 className={b('info', { message: true })}>{data?.message}</h4>}

            {signUpConditionError() && <h4 className={b('info', { warning: true })}>{infoSingUpObj.errorSingUp}</h4>}

            <form onSubmit={handleRegistry} name='signUp' className={b('form')}>
                <input required name='email' type="email" autoComplete='email' placeholder='e-mail' onChange={handleChangeForm} value={formObj.email} className={b('form__input')} />
                <div className={b('form__password-info')}>
                    <p className={b('form__password-info__title')}>Password should have</p>
                    <ul className={b('form__password-info__list')}>
                        <li className={b('form__password-info__list__list-element')}>at least one digit</li>
                        <li className={b('form__password-info__list__list-element')}>at least one capital letter</li>
                        <li className={b('form__password-info__list__list-element')}>one special sign</li>
                        <li className={b('form__password-info__list__list-element')}>small letters</li>
                    </ul>
                </div>

                <input required name='password' type="password" placeholder='password' autoComplete='current-password' onChange={handleChangeForm} value={formObj.password} className={b('form__input')} />

                <input type='password' name='secondPassword' autoComplete='new-password' placeholder='repeat password' onChange={handleChangeForm} value={formObj.secondPassword} className={b('form__input')} />

                <button className={b('form__signUp-btn')} type='submit'>Sign up</button>
            </form>

        </section>
    )
}

export default SignUp;
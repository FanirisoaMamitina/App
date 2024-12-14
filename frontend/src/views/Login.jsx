import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext()
    const [errors, setErrors] = useState(null)

    const [load, setLoad] = useState('off');

    const onSubmit = (ev) => {
        ev.preventDefault()
        setLoad('on');

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        setErrors(null)
        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors)
                    } else {
                        setErrors({
                            email: [response.data.message]
                        })
                    }
                    setLoad('off')
                }
            })
    }

    return (
        <>
            <h2 className="mt-6 text-center font-bold tracking-tight text-gray-300 lg:text-3xl md:text-2xl text-xl">
                Computer <span className="text-red-600">Store</span>
            </h2>

            <form onSubmit={onSubmit} className="mt-8 space-y-6" action="#">
                {errors && errors.general && (
                    <div className="bg-red-500 p-2 rounded-md">
                        <p className="text-white text-sm">{errors.general}</p>
                    </div>
                )}

                <div className='-space-y-px rounded-md'>
                    <div className="my-3">
                        <label htmlFor="email-address" className="sr-only">
                            Adresse Email
                        </label>
                        <input
                            ref={emailRef}
                            id="email-address"
                            name="email"
                            autoComplete="email"
                            type="email"
                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-none rounded-t-lg px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-dark-second"
                            placeholder="Adresse Email"
                        />
                        {errors && errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Mot de passe
                        </label>
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="relative block w-full shadow-sm shadow-black appearance-none rounded-none rounded-b-lg px-3 py-2 text-white bg-dark-second placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Mot de passe"
                        />
                        {errors && errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-red-700 py-2 px-4 text-sm font-medium text-white hover:bg-red-800 focus:outline-none "
                    >
                        {load == 'on' ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Se connecter</span>}
                    </button>
                </div>

                <p className="mt-2 text-end text-sm text-gray-600">
                    <Link to="/signup" className="font-medium text-indigo-600 text-decoration-none hover:text-indigo-500">
                        Creé compte
                    </Link>
                </p>
            </form>
        </>
    )
}

export default Login

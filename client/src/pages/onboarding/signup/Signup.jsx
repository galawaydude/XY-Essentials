import React from 'react'
import OAuth from '../../../components/oauth/OAuth'

const Signup = () => {
  return (
    <div className="login-maincon section container">
    <div className="login-con">
        <div className="login-head">
        <h3>    Sign up</h3>
        </div>
        <div className="login-form-con">
            <form className="login-form">
                <div className="input-component ">
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name" id='name' />
                </div>
                <div className="input-component ">
                    <label>Email</label>
                    <input type="email" placeholder="example@email.com" id='email' />
                </div>
                <div className="input-component ">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" id='password' />
                </div>

        

                <button className="btn btn-primary">
                    Sign up
                </button>

                <div className="using-google">
                    <p>or</p>
                   <OAuth/>
                </div>

                {/* <div className="divider"></div> */}

                <p className="login-text">Don't have an account? <span className='text-blue-700'>Login</span></p>
            </form>
        </div>
    </div>
</div>
  )
}

export default Signup
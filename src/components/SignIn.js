import { useState } from "react";

export default function SignIn({
  setRegisterData,
  registerData,
  registerMessage,
  registerUser,
  signInWithGoogle,
  signin,
  signInData,
  setSignInData,
  signinMessage,
}) {
  const [signUpView, setSignUpView] = useState(false);

  return (
    <div className="background">
      <div className="main-container">
        <header className={`header`}>
          <div className="flex justify-between px-2 py-1 items center">
            <h1 className="logo">
              <i className="ri-cloud-fill"></i>CloudChat
            </h1>
          </div>
        </header>
        {
          /* Sign In */
          !signUpView && (
            <>
              <section className={`signin-section`}>
                <h2 className="heading">Sign In</h2>

                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="text-input text-input-signin-width"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="text-input text-input-signin-width"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                />
                <div className="flex flex-col gap-2">
                  <button className="btn" onClick={signin}>
                    Sign in
                  </button>
                  <button className="btn" onClick={() => setSignUpView(true)}>
                    Create an account
                  </button>
                  <p>{signinMessage}</p>
                </div>
              </section>
            </>
          )
        }

        {
          /* Sign Up */
          signUpView && (
            <>
              <section className={`signin-section`}>
                <h2 className="heading">Sign Up</h2>

                <input
                  type="text"
                  placeholder="Your full name"
                  className="text-input text-input-signin-width"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="text-input text-input-signin-width"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Create a username"
                  className="text-input text-input-signin-width"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="text-input text-input-signin-width"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className="text-input text-input-signin-width"
                  value={registerData.passwordCheck}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      passwordCheck: e.target.value,
                    })
                  }
                />
                <div className="flex flex-col gap-1">
                  <button className="btn" onClick={registerUser}>
                    Sign Up
                  </button>
                  <p>{registerMessage}</p>
                  <button className="btn" onClick={() => setSignUpView(false)}>
                    Have an account?
                  </button>
                </div>
              </section>
            </>
          )
        }

        <button className="self-center btn" onClick={signInWithGoogle}>
          <i className="sign-in-btn-google-icon ri-google-fill"></i>{" "}
          <span className="align-top">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

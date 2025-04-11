import { IMaskInput } from "react-imask";
import "../../styles/AuthForm.scss";
import { GenderEnum } from "../../api/type";
import { useAuthFormLogic } from "./authFormUtils";

const AuthForm = () => {
  const {
    isLogin,
    flipping,
    apiError,
    loginErrors,
    signupErrors,
    register,
    handleSubmit,
    setValue,
    isSubmitting,
    handleSwitch,
    onSubmit,
  } = useAuthFormLogic();

  return (
    <div>
      <div className="auth-container">
        <div className="auth-switch">
          <button className={isLogin ? "active" : ""} onClick={() => handleSwitch(true)}>
            Log in
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => handleSwitch(false)}>
            Create account
          </button>
        </div>

        <div className={`auth-flip-box ${flipping ? "flipping" : ""}`}>
          <form className="auth-box" onSubmit={handleSubmit(onSubmit)}>
            {isLogin ? (
              <div className="signup-flip">
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    {...register("username")}
                    className={loginErrors?.username ? "error" : ""}
                  />
                  {loginErrors?.username && <p className="error-text">{loginErrors.username.message}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    className={loginErrors?.password ? "error" : ""}
                  />
                  {loginErrors?.password && <p className="error-text">{loginErrors.password.message}</p>}
                </div>
                {apiError && <p className="error-text">{apiError}</p>}
                <button type="submit" className="auth-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
                <p className="link">Forgot your password?</p>
                <p className="link" onClick={() => handleSwitch(false)}>
                  No account? Create one here!
                </p>
              </div>
            ) : (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    {...register("username")}
                    className={signupErrors?.username ? "error" : ""}
                  />
                  {signupErrors?.username && <p className="error-text">{signupErrors.username.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    {...register("full_name")}
                    className={signupErrors?.full_name ? "error" : ""}
                  />
                  {signupErrors?.full_name && <p className="error-text">{signupErrors.full_name.message}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={signupErrors?.email ? "error" : ""}
                  />
                  {signupErrors?.email && <p className="error-text">{signupErrors.email.message}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    className={signupErrors?.password ? "error" : ""}
                  />
                  {signupErrors?.password && <p className="error-text">{signupErrors.password.message}</p>}
                </div>
                <div>
                  <input
                    type="date"
                    placeholder="Birth date (YYYY-MM-DD)"
                    {...register("birth_date")}
                    className={signupErrors?.birth_date ? "error" : ""}
                  />
                  {signupErrors?.birth_date && <p className="error-text">{signupErrors.birth_date.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    {...register("city")}
                    className={signupErrors?.city ? "error" : ""}
                  />
                  {signupErrors?.city && <p className="error-text">{signupErrors.city.message}</p>}
                </div>
                <div>
                  <select
                    {...register("gender")}
                    className={signupErrors?.gender ? "error" : ""}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value={GenderEnum.Male}>Мужской</option>
                    <option value={GenderEnum.Female}>Женский</option>
                  </select>
                  {signupErrors?.gender && <p className="error-text">{signupErrors.gender.message}</p>}
                </div>
                <div>
                  <IMaskInput
                    mask="+{7} (000) 000-00-00"
                    placeholder="Phone number"
                    onAccept={(value) => setValue("phone_number", value, { shouldValidate: true })}
                    className={signupErrors?.phone_number ? "error" : ""}
                  />
                  {signupErrors?.phone_number && (
                    <p className="error-text">{signupErrors.phone_number.message}</p>
                  )}
                </div>
                {apiError && <p className="error-text">{apiError}</p>}
                <button type="submit" className="auth-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create account"}
                </button>
                <p className="link" onClick={() => handleSwitch(true)}>
                  Already have an account? Log in
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
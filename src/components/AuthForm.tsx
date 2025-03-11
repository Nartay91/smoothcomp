import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AuthForm.scss";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  const handleSwitch = (login: boolean) => {
    if (isLogin !== login) {
      setFlipping(true);
      setTimeout(() => {
        setIsLogin(login);
      }, 300);
      setTimeout(() => {
        setFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="auth-container">
      {/* Переключатель логина и регистрации */}
      <div className="auth-switch">
        <button className={isLogin ? "active" : ""} onClick={() => handleSwitch(true)}>
          Log in
        </button>
        <button className={!isLogin ? "active" : ""} onClick={() => handleSwitch(false)}>
          Create account
        </button>
      </div>

      {/* Блок формы */}
      <div className={`auth-flip-box ${flipping ? "flipping" : ""}`}>
        <div className={`auth-box ${isLogin ? "" : "signup-flip"}`}>
          {isLogin ? (
            <div>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="auth-btn">Log in</button>
              <p className="link">Forgot your password?</p>
              <p className="link" onClick={() => handleSwitch(false)}>
                No account? Create one here!
              </p>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="First name" />
              <input type="text" placeholder="Last name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="auth-btn">Create account</button>
              <p className="link" onClick={() => handleSwitch(true)}>
                Already have an account? Log in
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;


// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import "../styles/AuthForm.scss";

// const AuthForm = () => {
//   const [searchParams] = useSearchParams();
//   const mode = searchParams.get("mode"); // Получаем параметр из URL
//   const [isLogin, setIsLogin] = useState(mode !== "signup");
//   const [flipping, setFlipping] = useState(false);

//   useEffect(() => {
//     setIsLogin(mode !== "signup");
//   }, [mode]); 

//   const handleSwitch = (login: boolean) => {
//     if (isLogin !== login) {
//       setFlipping(true);
//       setTimeout(() => {
//         setIsLogin(login);
//       }, 300);
//       setTimeout(() => {
//         setFlipping(false);
//       }, 600);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-switch">
//         <button className={isLogin ? "active" : ""} onClick={() => handleSwitch(true)}>
//           Log in
//         </button>
//         <button className={!isLogin ? "active" : ""} onClick={() => handleSwitch(false)}>
//           Create account
//         </button>
//       </div>

//       <div className={`auth-flip-box ${flipping ? "flipping" : ""}`}>
//         <div className="auth-box">
//           {isLogin ? (
//             <div className="signup-flip">
//               <input type="email" placeholder="Email" />
//               <input type="password" placeholder="Password" />
//               <button className="auth-btn">Log in</button>
//               <p className="link">Forgot your password?</p>
//               <p className="link" onClick={() => handleSwitch(false)}>
//                 No account? Create one here!
//               </p>
//             </div>
//           ) : (
//             <>
//               <input type="text" placeholder="First name" />
//               <input type="text" placeholder="Last name" />
//               <input type="email" placeholder="Email" />
//               <input type="password" placeholder="Password" />
//               <button className="auth-btn">Create account</button>
//               <p className="link" onClick={() => handleSwitch(true)}>
//                 Already have an account? Log in
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;
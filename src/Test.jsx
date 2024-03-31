import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import OtpInput from "otp-input-react";
import { ImSpinner2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const Test = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setshowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }
  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        showOTP(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.success("OTP sent successfully!");
      });
  }
  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center leading-normal text-white font-medium text-2xl">
            Drop 2k
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-2xl">
              welcome to code a pro
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <FaShieldAlt size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-2xl text-white text-center"
                >
                  Enter your OTP
                </label>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                ></OtpInput>
                <button className="bg-emerald-600 flex justify-center items-center p-2.5 w-full gap-3 text-white rounded">
                  {loading && (
                    <ImSpinner2 size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillTelephoneFill size={30} />
                </div>
                <label
                  htmlFor="ph"
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"ng"} value={ph} onChange={setPh} />

                <button
                  onClick={onSignup}
                  className="bg-emerald-600 flex justify-center items-center p-2.5 w-full gap-3 text-white rounded"
                >
                  {loading && (
                    <ImSpinner2 size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Test;

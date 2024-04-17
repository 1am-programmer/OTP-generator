import { useState } from "react";
import React from "react";
import { GiPadlock } from "react-icons/gi";
import OtpInput from "otp-input-react";
import { FaSpinner } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase.config";
import { RecaptchaVerifier } from "firebase/auth";

import { toast, Toaster } from "react-hot-toast";
// These two when install adds country codes and their flags to your input
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

function App() {
  const [otp, setOtp] = useState("");
  //For the Otp input
  const [ph, setph] = useState("");
  //For country code
  const [loading, setLoading] = useState(false);
  //For the spinner

  const [showOTP, setshowOTP] = useState(false);
  // To display which page shows, either the input OTP or input number

  const [user, setUser] = useState(null);

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            //Allow sign up with phone number
            onSignup();
          },
          "expired-callback": () => {
            //Respone expired, Ask user to resolve recaptcha
          },
        },
        auth
      );
    }
  }
  function onSignup() {
    setLoading(true);
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    const auth = getAuth();
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setshowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }
  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .className((err) => {
        console.log(err);
        setLoading(false);
        // catch error
      });
  }

  return (
    <section className="bg-gray-600 flex items-center justify-center min-h-screen">
      <div>
        <Toaster toastOptions={{ duration: 2000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="">As you pass the OTP so, just send 2k to my opay </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1
              className="text-center text white font-medium text-3xl mb-6
          "
            >
              OTP verification with Firebase
            </h1>
            {
              // IF otp showOtp is true, show input otp,else show input phone number
              showOTP ? (
                <>
                  <div className="w-fit bg-white p-4 rounded-full items-center mx-auto">
                    <GiPadlock size={30} />
                  </div>
                  <label
                    htmlFor="otp"
                    className="font-bold text-2xl text-center"
                  >
                    Enter Your OTP
                    {/* //Means we are linking the label to an input that has the ID of ph */}
                  </label>
                  <OtpInput
                    OTPLength={6}
                    value={otp}
                    // Otp is the initial state
                    onChange={setOtp}
                    //The useState of the Otp state
                    otpType="number"
                    disabled={false}
                    className="opt-container"
                  ></OtpInput>

                  <button
                    onClick={onOTPVerify}
                    className="flex justify-center items-center w-full bg-slate-500 text-white font-bold py-2 px-4  gap-2 rounded-full"
                  >
                    {loading && <FaSpinner className="mt-1 animate-spin" />}
                    {/* Simply means if loading is true, show the spinner */}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-fit bg-white p-4 rounded-full items-center mx-auto">
                    <BsFillTelephoneFill size={30} />
                  </div>

                  <label htmlFor="" className="font-bold text-xl text-center ">
                    Verify using your Mobile number
                    {/* //Means we are linking the label to an input that has the ID of ph */}
                  </label>
                  <PhoneInput country={"us"} value={ph} onChange={setph} />
                  <button
                    onClick={onSignup}
                    className="flex justify-center items-center w-full bg-slate-500 text-white font-bold py-2 px-4  gap-2 rounded-full"
                  >
                    {loading && <FaSpinner className="mt-1 animate-spin" />}
                    {/* Simply means if loading is true, show the spinner */}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )
            }
          </div>
        )}
      </div>
    </section>
  );
}

export default App;

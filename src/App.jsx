import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcodejs2"; // qrcodejs2 is a maintained fork of qrcodejs
import { saveAs } from "file-saver";

const countries = [
  { code: "1", name: "United States", flag: "🇺🇸" },
  { code: "44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "91", name: "India", flag: "🇮🇳" },
  { code: "92", name: "Pakistan", flag: "🇵🇰" },
  { code: "61", name: "Australia", flag: "🇦🇺" },
  { code: "81", name: "Japan", flag: "🇯🇵" },
  { code: "49", name: "Germany", flag: "🇩🇪" },
  { code: "33", name: "France", flag: "🇫🇷" },
  { code: "55", name: "Brazil", flag: "🇧🇷" },
  { code: "7", name: "Russia", flag: "🇷🇺" },
  // Add more as needed
];

function App() {
  const [countryCode, setCountryCode] = useState("1");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const qrRef = useRef(null);

  const validatePhone = (num) => {
    const regex = /^[0-9]{5,15}$/;
    return regex.test(num);
  };

  const generateQR = () => {
    setError("");
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number (5-15 digits).");
      setQrGenerated(false);
      return;
    }

    const fullNumber = countryCode + phone;
    const url = `https://wa.me/${fullNumber}`;

    qrRef.current.innerHTML = "";

    new QRCode(qrRef.current, {
      text: url,
      width: 256,
      height: 256,
      colorDark: darkMode ? "#ffffff" : "#000000",
      colorLight: darkMode ? "#000000" : "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    setQrGenerated(true);
  };

  const downloadQR = () => {
    if (!qrGenerated) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      saveAs(blob, `whatsapp-qr-${countryCode}${phone}.png`);
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 flex flex-col items-center p-4">
      <header className="max-w-xl w-full text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Generate your WhatsApp QR in seconds
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Enter your phone number and share your WhatsApp chat easily.
        </p>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateQR();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="flex space-x-3 items-center">
            <div className="relative w-28">
              <select
                id="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="appearance-none w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 py-2 pr-8 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer"
                aria-label="Select country code"
              >
                {countries.map(({ code, name, flag }) => (
                  <option key={code} value={code}>
                    {flag} +{code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
                </svg>
              </div>
            </div>

            <div className="relative flex-1">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                }}
                required
                className="peer placeholder-transparent w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="Phone number"
                aria-describedby="phoneHelp"
                aria-invalid={error ? "true" : "false"}
              />
              <label
                htmlFor="phone"
                className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300"
              >
                Phone number
              </label>
            </div>
          </div>

          {error && (
            <p
              className="text-red-600 dark:text-red-400 text-sm"
              role="alert"
              id="phoneHelp"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition"
          >
            Generate QR
          </button>
        </form>

        {qrGenerated && (
          <section
            className="mt-8 flex flex-col items-center space-y-4"
            aria-live="polite"
          >
            <div
              ref={qrRef}
              className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
              aria-label="WhatsApp QR code"
            ></div>
            <button
              onClick={downloadQR}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition transform active:scale-95"
            >
              Download QR
            </button>
            <p className="text-gray-700 dark:text-gray-300 text-center max-w-xs">
              Now scan or share your QR anytime!
            </p>
          </section>
        )}
      </main>

      <footer className="mt-12 max-w-xl text-center text-gray-600 dark:text-gray-400 text-sm px-4">
        <h2 className="font-semibold mb-2">How it works</h2>
        <p>
          Enter your phone number with country code, then generate a QR code.
          When scanned, it opens a WhatsApp chat with you. Download and share
          your QR code easily.
        </p>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let gsiScriptPromise = null;

function loadGsiScript() {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }
    if (gsiScriptPromise) {
        return gsiScriptPromise;
    }

    gsiScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Failed to load Google script")));
            return;
        }
        const script = document.createElement("script");
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google script"));
        document.head.appendChild(script);
    });

    return gsiScriptPromise;
}

function GoogleSignInButton({ onCredential, onError, text = "signin_with" }) {
    const buttonRef = useRef(null);
    const [unavailable, setUnavailable] = useState(!CLIENT_ID);

    useEffect(() => {
        if (!CLIENT_ID) {
            return;
        }

        let cancelled = false;

        loadGsiScript()
            .then(() => {
                if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: (response) => {
                        if (response?.credential) {
                            onCredential(response.credential);
                        } else if (onError) {
                            onError(new Error("No credential returned from Google"));
                        }
                    }
                });

                buttonRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: "outline",
                    size: "large",
                    width: 340,
                    text,
                    logo_alignment: "center"
                });
            })
            .catch((err) => {
                if (!cancelled) {
                    setUnavailable(true);
                    if (onError) onError(err);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [onCredential, onError, text]);

    if (unavailable) {
        return null;
    }

    return <div ref={buttonRef} style={{ display: "flex", justifyContent: "center" }} />;
}

export default GoogleSignInButton;

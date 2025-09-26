import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config.js";

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Usuario registrado:", userCredential.user);
      alert(`Usuario registrado: ${userCredential.user.email}`);
      window.location.href = "usuario.html"; // Redirige al panel
    } catch (error) {
      console.error("❌ Error al registrar:", error.code, error.message);
      alert("Error al registrar: " + error.message);
    }
  });
}

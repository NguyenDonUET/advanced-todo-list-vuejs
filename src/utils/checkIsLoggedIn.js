import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function checkIsLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return true;
        } else {
            return false;
        }
    });
}

import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../../lib/firebase";

const getSettings = async () => {
  try {
    const settingsRef = doc(db, "settings", "settings");
    const docRef = await getDoc(settingsRef);
    if (docRef.exists()) {
      console.log("Settings fetched");
      return docRef.data();
    } else {
      console.log("Settings not found");
      return null;
    }
  } catch (error) {
    console.error("Error in getSettings:", error);
  }
};

const setSettings = async (settings) => {
  try {
    const settingsRef = doc(db, "settings", "settings");
    await setDoc(settingsRef, settings);
    console.log("Settings updated");
  } catch (error) {
    console.error("Error in setSettings:", error);
  }
};

export { getSettings, setSettings };

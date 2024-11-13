import {
  getCountFromServer,
  doc,
  getDoc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

const recreateTesterUser = async (group, stage) => {
  try {
    const testerId = "tester";
    const userRef = doc(db, "users", testerId);

    // Delete the existing user with ID "tester"
    await deleteDoc(userRef);
    console.log(`User with ID "${testerId}" has been deleted.`);

    // Create a new user with the provided group and stage
    await setDoc(userRef, { id: testerId, group, stage });
    console.log(
      `User recreated with ID: ${testerId}, group: ${group}, stage: ${stage}`
    );

    // Return the newly created user data
    return { id: testerId, group, stage };
  } catch (error) {
    console.error("Error in recreateTesterUser:", error);
    throw error;
  }
};

const postOrGetUserId = async (id) => {
  try {
    const userRef = doc(db, "users", id);
    const docRef = await getDoc(userRef);
    if (!docRef.exists()) {
      const group = await decideAboutUserGroups();
      await setDoc(userRef, { id, group, stage: 1 });
      console.log(`User created with ID: ${id}, group: ${group}, stage: 1`);
      return { id, group, stage: 1 };
    } else {
      console.log(`User fetched with ID: ${id}`);
      return docRef.data();
    }
  } catch (error) {
    console.error("Error in postOrGetUserId:", error);
  }
};

const decideAboutUserGroups = async () => {
  try {
    const coll = collection(db, "users");
    const snapshot = await getCountFromServer(coll);
    const size = snapshot.data().count - 1;
    let group = (size % 4) + 1;
    if (group === 1) {
      group = 3;
    } else if (group === 2) {
      group = 4;
    } else if (group === 3) {
      group = 10;
    } else if (group === 4) {
      group = 11;
    }
    return group;
  } catch (error) {
    console.error("Error in decideAboutUserGroups:", error);
  }
};

const setUserOnDb = async (user) => {
  try {
    const userRef = doc(db, "users", user.id);
    let didAnswerAttentionQuestion =
      localStorage.getItem("attentionQuestion") === "0";
    await setDoc(userRef, { ...user, didAnswerAttentionQuestion });
    console.log(`User updated with ID: ${user.id}`);
  } catch (error) {
    console.error("Error in setUser:", error);
  }
};

const getAllUsers = async () => {
  try {
    const coll = collection(db, "users");
    const snapshot = await getDocs(coll);
    const users = snapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
  }
};

export { postOrGetUserId, setUserOnDb, getAllUsers, recreateTesterUser };

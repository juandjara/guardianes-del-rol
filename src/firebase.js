import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const client = firebase.initializeApp({
  apiKey: 'AIzaSyA9EypsIdvoeuYtw5op7wJrxYhA5LUoRPw',
  authDomain: `guardianes-2018.firebaseapp.com`,
  databaseURL: `https://guardianes-2018.firebaseio.com`,
  storageBucket: `gs://guardianes-2018.appspot.com`,
  projectId: 'guardianes-2018'
})
const googleProvider = new firebase.auth.GoogleAuthProvider();

export function loginWithGoogle() {
  firebase.auth().useDeviceLanguage();
  return firebase.auth().signInWithPopup(googleProvider);
}

export const auth    = client.auth()
export const storage = client.storage().ref()
export const db      = client.firestore()
db.settings({timestampsInSnapshots: true})

export default client

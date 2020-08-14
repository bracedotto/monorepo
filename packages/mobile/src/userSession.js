// @ts-ignore
import RNBlockstackSdk from 'react-native-blockstack';

/* Need this sync function to check if session is available in ReduxOffline peek  */
let _didSessionCreate = false;
const didSessionCreate = () => {
  return _didSessionCreate;
};

const hasSession = async () => {
  const { hasSession } = await RNBlockstackSdk.hasSession();
  _didSessionCreate = hasSession;
  return hasSession;
};

const createSession = async (config) => {
  const { loaded } = await RNBlockstackSdk.createSession(config);
  _didSessionCreate = true;
  return loaded;
};

const isUserSignedIn = async () => {
  const { signedIn } = await RNBlockstackSdk.isUserSignedIn();
  return signedIn;
};

const signIn = async () => {
  return await RNBlockstackSdk.signIn();
};

const handlePendingSignIn = async (/** @type {string} */ authResponse) => {
  const { loaded } = await RNBlockstackSdk.handlePendingSignIn(authResponse);
  return loaded;
};

const signUserOut = async () => {
  const { signedOut } = await RNBlockstackSdk.signUserOut();
  return signedOut;
};

const loadUserData = async () => {
  return await RNBlockstackSdk.loadUserData();
};

const listFiles = async (callback) => {
  const { files, fileCount } = await RNBlockstackSdk.listFiles();
  files.forEach(file => callback(file));
  return fileCount;
};

const getFile = async (path, options = { decrypt: true }) => {
  const result = await RNBlockstackSdk.getFile(path, options);
  return result.fileContents || result.fileContentsEncoded;
};

const putFile = async (path, content, options = { encrypt: true }) => {
  const { fileUrl } = await RNBlockstackSdk.putFile(path, content, options);
  return fileUrl;
};

const deleteFile = async (path, options = { wasSigned: false }) => {
  const { deleted } = await RNBlockstackSdk.deleteFile(path, options);
  return deleted;
};

export default {
  didSessionCreate,
  hasSession, createSession,
  isUserSignedIn, signIn, handlePendingSignIn, signUserOut,
  loadUserData,
  listFiles, getFile, putFile, deleteFile
};
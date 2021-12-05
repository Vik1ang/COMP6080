import localforage from "localforage";
import { findIndex, isEqual } from "./lodash";

export function fileToDataUrl(file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = findIndex(validFileTypes, obj=>isEqual(obj, file.type));
  if (valid === -1) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const urlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return urlPromise;
}


export async function isLogin() {
  const token = await localforage.getItem('token');
  return !isEqual(token, null);
}


export function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
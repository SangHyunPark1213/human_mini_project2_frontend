import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 이미지 1장 업로드 → URL 반환
export const uploadImage = async (file, folder = "reviews") => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// 이미지 여러 장 업로드 → URL 배열 반환
export const uploadImages = async (files, folder = "reviews") => {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
};

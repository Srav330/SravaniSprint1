import {getStorage,ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";

import { STORAGE_FOLDER_NAMES } from "../model/constants.js";

const storage = getStorage();

 export async function uploadProfilePhoto(photoFile, imageName){
     const storageRef = ref(storage, STORAGE_FOLDER_NAMES.PROFILE_PHOTOS + imageName);
     const snapShot = await uploadBytes(storageRef, photoFile);
     const photoURL = await getDownloadURL(snapShot.ref);
     return photoURL;
 }

 export async function uploadImage(imageFile, imageName){
         if(!imageName){
            imageName=imageFile.name+Date.now();
        }

    const storageRef = ref(storage, STORAGE_FOLDER_NAMES.PRODUCT_IMAGES + imageName);
    const snapShot = await uploadBytes(storageRef, imageFile);
    const imageURL = await getDownloadURL(snapShot.ref);
    return {imageName, imageURL};

}


export async function deleteProductImage(imageName){
    const storageRef = ref(storage, STORAGE_FOLDER_NAMES.PROFILE_PHOTOS + imageName);
    await deleteObject(storageRef);
}
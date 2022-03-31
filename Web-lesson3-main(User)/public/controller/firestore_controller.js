import {
    getFirestore,
    query,
    collection,
    orderBy,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    where,
    doc,
    updateDoc,
} from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { AccountInfo } from "../model/account_info.js";

import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
import { ShoppingCart } from "../model/shopping_cart.js";
import { Review } from "../model/review.js";    
const db = getFirestore();

export async function sendReview(review){
    let data=new Review(review);
    let data1={...data}
    await addDoc(collection(db,COLLECTION_NAMES.REVIEW), data1);

    let rId=review.productHistoryId;
    const q = query(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), 
    where('__name__','==',rId));
    const snapShot = await getDocs(q);
    let newData={};
    snapShot.forEach(doc => {
        newData.data=doc.data();
    });

    let isChanged=false;
    for(let i = 0;i<newData.data.items.length;i++){
        if(newData.data.items[i].pid === data.pid){
            isChanged=true;
            newData.data.items[i].isReviewed=true;
        }
    }
    const docRef = doc(db, COLLECTION_NAMES.PURCHASE_HISTORY,rId);
    await updateDoc(docRef, newData.data);
}

export async function getReviews(prodId){
    const q = query(collection(db, COLLECTION_NAMES.REVIEW),where('pid','==',prodId));
    let snapShots = await getDocs(q);
    let userreviews=[];
    snapShots.forEach(doc => {
        userreviews.push(doc.data())
    });
    return(userreviews)
}


export async function getProductList(){
    const products = [];
    const q = query(collection(db,COLLECTION_NAMES.PRODUCT),orderBy('name'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function checkout(cart){
    const data = cart.serialize(Date.now());
    await addDoc(collection(db,COLLECTION_NAMES.PURCHASE_HISTORY), data);

}

export async function getPurchaseHistory(uid){
    const q = query(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), 
    where('uid','==',uid), 
    orderBy('timestamp','desc'));
    const snapShot = await getDocs(q);

    const carts = [];
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data());
        sc.docId=doc.id;
        carts.push(sc);
    });
    return carts;
}

export async function getAccountInfo(uid){
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        return new AccountInfo(docSnap.data());
    }
    else{
        const defaultInfo = AccountInfo.instance();
        const accountDocRef =  doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
        await setDoc(accountDocRef, defaultInfo.serialize());
        return defaultInfo;
    }
}

export async function updateAccountInfo(uid, updateInfo){
    // updateInfo = {key: value}
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO,uid);
    await updateDoc(docRef, updateInfo);
}
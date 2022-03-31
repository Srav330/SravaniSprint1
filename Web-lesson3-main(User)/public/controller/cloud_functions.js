import { 
    getApp, initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { 
    getFunctions, httpsCallable,connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-functions.js";


const app = initializeApp({
    projectId: 'cmsc5373-sravani-webapps',
    apiKey: '0f70ea86e7ab8ca41f2c25040dd62533cc333c79',
    authDomain: 'https://accounts.google.com/o/oauth2/auth',
  });


const functions = getFunctions(app);

import { Product } from "../model/product.js";
import { currentUser } from "./firebase_auth.js";


// setup for emulator
const hostname = window.location.hostname;
if(hostname=='localhost' || hostname == '127.0.0.1'){
    connectFunctionsEmulator(functions,hostname, 3001);
}

const cfn_addProduct = httpsCallable(functions, 'cfn_addProduct');
export async function addProduct(product) {
    const result = await cfn_addProduct(product);
    return result.data;
}

const cfn_getProductList = httpsCallable(functions, 'cfn_getProductList');
export async function getProductList(){
    const products = []; // array of Product object
    const result = await cfn_getProductList({email:currentUser.email});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}

const cfn_deleteProductDoc = httpsCallable(functions, 'cfn_deleteProductDoc');
export async function deleteProductDoc(docId){
    await cfn_deleteProductDoc(docId);
}

const cfn_getProductById = httpsCallable(functions, 'cfn_getProductById');
export async function getProductById(docId){
    const result = await cfn_getProductById(docId);
    if(result.data){
        const product = new Product(result.data);
        product.set_docId(result.data.docId);
        return product;
    } else {
        return null;
    }
}

const cfn_updateProductDoc = httpsCallable(functions, 'cfn_updateProductDoc');
export async function updateProductDoc(product){
    const docId = product.docId;
    const updateObject = product.toFirestoreForUpdate();
    await cfn_updateProductDoc({docId,updateObject});
}

const cfn_getUserList = httpsCallable(functions, 'cfn_getUserList');
export async function getUserList(){
    const result = await cfn_getUserList({email:currentUser.email});
    result.data.sort((a,b) => {
        if(a.email>b.email) return 1;
        else if(a.email < b.email) return -1;
        else return 0;
    })
    return result.data;
}

const cfn_updateUser = httpsCallable(functions, 'cfn_updateUser');
export async function updateUser(uid, update){
    await cfn_updateUser({uid, update,email:currentUser.email});
}

const cfn_deleteUser = httpsCallable(functions,'cfn_deleteUser');
export async function deleteUser(uid){
    await cfn_deleteUser({uid,email:currentUser.email});
}
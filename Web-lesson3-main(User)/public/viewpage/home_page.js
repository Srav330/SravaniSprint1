import { MENU,root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getProductList, getReviews } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { isAdmin } from '../controller/firebase_auth.js';
import * as Constants from "../model/constants.js";
import * as CloudFunctions from '../controller/cloud_functions.js'
import { modalProductDetail } from './elements.js';
import { Product } from '../model/product.js';
import * as Elements from './elements.js';
import * as CloudStorage from '../controller/storage_controller.js';
import * as EditProduct from "../controller/edit_product.js"


let imageFile2Upload;
let product_id={};

export function addEventListeners(){
    MENU.Home.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home,label);
    });

    MENU.HomeAdmin.addEventListener('click',async()=>{
        history.pushState(null,null,ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home,label);
    });


    Elements.formAddProduct.imageButton.addEventListener('change', e=>{
        imageFile2Upload = e.target.files[0];
        if(!imageFile2Upload){
            Elements.formAddProduct.imageTag.removeAttribute('src');
            return;
        }
        const reader = new FileReader(); // Local File Referenced by this Object.
        reader.readAsDataURL(imageFile2Upload); // Load
        reader.onload = () => Elements.formAddProduct.imageTag.src = reader.result; //Render
    });

    Elements.formAddProduct.form.addEventListener('submit',addNewProduct);
}

export async function home_page(){
    MENU.AdminNav.style.display="none";
    // MENU.UserNav.style.display="none";
    root.innerText=`Loading...`;

    // ADMIN HOME PAGE
    if (isAdmin && currentUser){
        MENU.Banner.innerHTML='Welcome to Admin Page';
        MENU.UserNav.style.display="none";
        MENU.AdminNav.style.display="block";

        let html= `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>  
        `;

        let products;
        try{
            products = await CloudFunctions.getProductList();
        }catch(e){
            if(Constants.DEV) console.log(e);
            Util.info('Cannot get product list', JSON.stringify(e));
            return;
        }

        products.forEach(p => {
            html += buildAdminProductCard(p);
        });

        root.innerHTML = html;

        const forms=document.getElementsByClassName('form-edit-delete-product');
        console.log(forms)
        for(let i=0;i< forms.length;i++)
        {
            forms[i].addEventListener('submit',async e=> {
                e.preventDefault();
                const buttons = e.target.getElementsByTagName('button');
                const submitter = e.target.submitter;
                if(submitter=='EDIT'){
                    const label=Util.disableButton(buttons[0]);
                    let singleProductId=e.target.docId.value;
                    console.log(singleProductId);
                    await EditProduct.edit_product(singleProductId);
                    //await Util.sleep(1000);
                    Util.enableButton(buttons[0],label);
                }else if(submitter=='DELETE'){
                    const label = Util.disableButton(buttons[1]);
                    let singleProductId=e.target.docId.value;
                    console.log(singleProductId);
                    await EditProduct.delete_product(singleProductId,e.target.imageName.value);
                    //await Util.sleep(1000);
                    Util.enableButton(buttons[1],label);
                }
                else{
                    console.log('No suc submitter', submitter);
                }
                //const submitter=e.target.submitter;
                //const docId=e.target.docId.value;
                //const imageName=e.target.imageName.value;
            })
        }
    }


    // USER HOME PAGE
    if(!isAdmin){
        // MENU.UserNav.style.display="block";

        let html = '<h1>Enjoy Shopping</h1>';
        let products;
        try{
            products = await getProductList();
            if(cart && cart.getTotalQty()!=0){
                cart.items.forEach(item => {
                    const p = products.find(e => e.docId == item.docId)
                    if(p) p.qty = item.qty;                
                });
            }
        } catch(e) {
            if(DEV) console.log(e);
            Util.info('Failed to get the product list',JSON.stringify(e));
        }

        for(let i=0;i<products.length;i++){
            html += buildProductView(products[i],i)
        }

        root.innerHTML = html;

        const productForms = document.getElementsByClassName('form-product-qty');
        for( let i=0 ; i < productForms.length ; i++){
            productForms[i].addEventListener('submit',e => {
                e.preventDefault();
                const p = products[e.target.index.value];
                const submitter = e.target.submitter;
                if(submitter == 'DEC'){
                    cart.removeItem(p);
                    if(p.qty > 0) --p.qty;
                } else if (submitter == 'INC'){
                    p.pid=p.docId;
                    p.isReviewed=false
                    cart.addItem(p);
                    p.qty = p.qty == null ? 1:p.qty + 1;
                } else {
                    if(DEV) console.log(e);
                    return;
                }
                const updateQty = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
                document.getElementById(`item-count-${p.docId}`).innerHTML = updateQty;
                MENU.CartItemCount.innerHTML = `${cart.getTotalQty()}`;
            })
        }

        const productCard=document.getElementsByClassName("product-card");
        for(let i=0; i<productCard.length;i++){
            productCard[i].addEventListener("click",async()=>{
                const prod=products.find(p=> p.docId === productCard[i].id);
                console.log(prod);
                const userreviews =await getReviews(productCard[i].id);
                let data = {
                    prod:prod,
                    userreviews:userreviews
                }
                console.log(data);
                modalProductDetail.body.innerHTML=buildProductModal(data);
                modalProductDetail.modal.show();
            }); 
        }
    }
}

function buildProductModal(data){
    let html=`
    <div class="d-flex">
        <img class="w-25" src="${data.prod.imageURL}" class="card-img-top">
        <div style="margin-left:20px;">
            <h5 class="card-title"><h5 style="display:inline;">Name: </h5> ${data.prod.name}</h5>
            <p class="card-text"><h5 style="display:inline;">Price: </h5> ${data.prod.price}</p>
            <p class="card-text"><h5 style="display:inline;">Summary: </h5> ${data.prod.summary}</p>
        </div>
    </div>
    <div>
        <h5 class="card-title">${'Reviews:'}</h5>
    </div>
    `

    data.userreviews.forEach(p=>{
        html+=`
            <div style="display:block;">
                <h5 class="card-title"><h5 style="display:inline;">Email: </h5> ${p.email}</h5>
                <p class="card-text"><h5 style="display:inline;">Feedback: </h5> ${p.feedback}</p>
                `;

                html+=`
                <div class="rate1" id="stars">
                    `
                    for(let i=0;i<parseInt(p.star);i++){
                        if (i< parseInt(p.star)){
                            html+=`
                            <input type="radio" style="background:#ffc700 ;" id="star-5" name="rate"/>
                            <label for="star-5" title="text"></label>
                        `
                        }
                        
                    }
                html+=`
                </div>
                <br>
                <br>
                <hr>
            </div>`

    })
    
    // html+=`
    // </div>
    // `
    return html;    
}

function buildProductView(product, index){
    return `
    <div id="card-${product.docId}" class="card d-inline-flex" style="width: 18rem; display: inline-block;">
        <img style="cursor:pointer;" src="${product.imageURL}" id="${product.docId}" class="card-img-top product-card">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
            ${Util.currency(product.price)}<br>
            ${product.summary}</p>

            <div class="container pt-3 bg-light ${currentUser ? 'd-block' : 'd-none'}">
                <form method="post" class="form-product-qty">
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='DEC'">&minus;</button>
                    <div id="item-count-${product.docId}"
                        class="container round text-center text-white bg-primary d-inline-block w-50">
                        ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                    </div>
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='INC'">&plus;</button>
                </form>
            </div>
        </div>
    </div>
    `;
}

function buildAdminProductCard(product){
    return `
    <div id="card-${product.docId}" class="card d-inline-flex" style="width: 18rem;">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price.toFixed(2)}<br>${product.summary}</p>
            <form class="form-edit-delete-product" method="post">
                <input type="hidden" id="productIdDelete" name="docId" value="${product.docId}">
                <input type="hidden" name="imageName" value="${product.imageName}">
                <button  type="submit" class="btn btn-outline-primary"
                    onclick="this.form.submitter='EDIT'" data-bs-toggle="modal" data-bs-target="#modal-edit-product">Edit</button>
                <button id="${product.docId}" type="submit" class="btn btn-outline-danger delete-button"
                    onclick="this.form.submitter='DELETE';">Delete
                </button>
            </form>
        </div>
    </div>
    `;
}

async function addNewProduct(e){
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    const summary = e.target.summary.value;

    const product = new Product({name,price,summary});

    const button = e.target.getElementsByTagName('button')[0];
    const label = Util.disableButton(button);

    try{
        // upload the product image => imageName, imageURL
        const {imageName, imageURL} = await CloudStorage.uploadImage(imageFile2Upload);
        product.imageName = imageName;
        product.imageURL = imageURL;
        const docId = await CloudFunctions.addProduct(product.toFireStore());
        Util.info('Success!',`Added: ${product.name} ,docId=${docId}`, Elements.modalAddProduct);
        e.target.reset();
        Elements.formAddProduct.imageTag.removeAttribute('src');
        await home_page();
    } catch(e){
        if(Constants.DEV) console.log(e);
        Util.info('Add Product Failed',`${e.code}: ${e.name} = ${e.message}`,Elements.modalAddProduct);
    }

    Util.enableButton(button, label);
}
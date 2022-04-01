//main root element
export const root = document.getElementById('root');

export const MENU = {
    HomeAdmin:document.getElementById('menu-home-admin'),
    SignIn : document.getElementById('menu-signin'),
    Home : document.getElementById('menu-home'),
    Purchases : document.getElementById('menu-purchases'),
    SignOut : document.getElementById('menu-signout'),
    SignOutAdmin:document.getElementById('menu-signout-admin'),
    Cart: document.getElementById('menu-cart'),
    Profile: document.getElementById('menu-profile'),
    CartItemCount: document.getElementById('menu-cart-item-count'),
    Banner:document.getElementById('nav-banner'),
    AdminNav:document.getElementById('admin-nav'),
    UserNav:document.getElementById('user-nav'),
    menuUsers:document.getElementById('menu-users')
}

export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
}

export const formEditProduct = {
    form: document.getElementById('form-edit-product'),
    imageTag: document.getElementById('form-edit-product-image-tag'),
    imageButton: document.getElementById('form-edit-product-image-button'),
}

//Form
//export const formSignIn = document.getElementById('form-signin');
/*export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
}*/
// export const formEditProduct = {
//     form: document.getElementById('form-edit-product'),
//     imageTag: document.getElementById('form-edit-product-image-tag'),
//     imageButton: document.getElementById('form-edit-product-image-button'),
// }
//Modals
export const modalInfobox = {
    modal:new bootstrap.Modal(document.getElementById('modal-infobox'), {backdrop: 'static'}),
    title:document.getElementById('modal-infobox-title'),
    body:document.getElementById('modal-infobox-body'),
}

export const modalTransaction ={
    modal: new bootstrap.Modal(document.getElementById('modal-transaction'),{backdrop:'static'}),
    title: document.getElementById('modal-transaction-title'),
    body: document.getElementById('modal-transaction-body')
}

export const modalReview ={
    modal: new bootstrap.Modal(document.getElementById('modal-Review'),{backdrop:'static'}),
    title: document.getElementById('modal-review-title'),
    body: document.getElementById('modal-review-body')
}

export const modalProductDetail ={
    modal: new bootstrap.Modal(document.getElementById('modal-product-detail'),{backdrop:'static'}),
    title: document.getElementById('modal-product-detail-title'),
    body: document.getElementById('modal-product-detail-body')
}

export const modalSignin = {
    modal:new bootstrap.Modal(document.getElementById('modal-signin'),{backdrop:'static'}),
    form: document.getElementById('form-signin'),
    showSignupModal: document.getElementById('button-show-signup-modal'),
}

export const modalSignup = {
    modal:new bootstrap.Modal(document.getElementById('modal-signup'),{backdrop:'static'}),
    form: document.getElementById('modal-signup-form'),
}

export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'),{backdrop:'static'});
export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'),{backdrop:'static'});

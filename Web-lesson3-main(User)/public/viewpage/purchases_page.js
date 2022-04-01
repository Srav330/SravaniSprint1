import { MENU,root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { currentUser } from '../controller/firebase_auth.js';
import { getPurchaseHistory } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { modalTransaction,modalReview,modalProductDetail } from './elements.js';
import { sendReview } from '../controller/firestore_controller.js';
import { currency,disableButton,enableButton, info } from './util.js';


export function addEventListeners(){
    MENU.Purchases.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.PURCHASES);
        const label = Util.disableButton(MENU.Purchases);
        await purchases_page();
        Util.enableButton(MENU.Purchases,label);
    });

}

export async function purchases_page(){
    MENU.AdminNav.style.display="none";

    if(!currentUser){
        root.innerHTML = '<h1> Protected Page</h1>';
        return;
    }

    let html = '<h1>Purchase History</h1>'

    let carts;
    let purchaseHistoryId;
    try{
        carts = await getPurchaseHistory(currentUser.uid);
        if(carts.length == 0){
            html += '<h3>No Purchase History Found!</h3>';
            root.innerHTML = html;
            return;
        }

    }catch(e){
        if(DEV) console.log(e);
        Util.info('Error in getPurchaseHistory',JSON.stringify(e));
        root.innerHTML = '<h1>Failed to get purchase history</h1>';
        return;
    }

    html += `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">View</th>
        <th scope="col">Items</th>
        <th scope="col">Price</th>
        <th scope="col">Date</th>
      </tr>
    </thead>
    <tbody>
    `;

    for(let i=0;i<carts.length;i++){
        html += `
        <tr>
            <td>
                <form id="${carts[i].docId}" method="post" class="form-purchase-details">
                    <input type="hidden" name="index" value="${i}">
                    <button type="submit" class="btn btn-outline-primary">Details</button>
                </form
            </td>
            <td>${carts[i].getTotalQty()}</td>
            <td>${Util.currency(carts[i].getTotalPrice())}</td>
            <td>${new Date(carts[i].timestamp).toString()}</td>
        </tr>
        `;
    }

    html+='</tbody></table>';
    root.innerHTML = html;

    const detailsFrom = document.getElementsByClassName('form-purchase-details');
    for(let i=0;i<detailsFrom.length;i++){
        detailsFrom[i].addEventListener('submit',e=>{
            e.preventDefault();
            purchaseHistoryId=detailsFrom[i].id;
            const index = e.target.index.value;
            modalTransaction.title.innerHTML = `Purchased At: ${new Date(carts[index].timestamp).toString()}`;
            modalTransaction.body.innerHTML = buildTransactionView(carts[index]);


            const reviewButton = document.getElementsByClassName("form-review");

            for(let i=0;i<reviewButton.length;i++){
                reviewButton[i].addEventListener('click',async (e)=>{
                    e.preventDefault();  
                    console.log()
                    const pid=reviewButton[i].id;
                    modalReview.body.innerHTML=buildReviewForm(pid);
                    modalReview.modal.show();

                    let review={}
                    review.pid=pid;
                    review.productHistoryId=purchaseHistoryId;
                    document.getElementById("stars-value1").addEventListener('click',async()=>{console.log('1');review.star="1"});
                    document.getElementById("stars-value2").addEventListener('click',async()=>{console.log('2');review.star="2"});
                    document.getElementById("stars-value3").addEventListener('click',async()=>{console.log('3');review.star="3"});
                    document.getElementById("stars-value4").addEventListener('click',async()=>{console.log('4');review.star="4"});
                    document.getElementById("stars-value5").addEventListener('click',async()=>{console.log('5');review.star="5"});
                    
                    const reviewForm=document.getElementById('submit-form-review');
                    reviewForm.addEventListener('submit',async(e)=>{
                        e.preventDefault();
                        review.feedback=document.getElementById('feedback').value;
                        review.userId=currentUser.reloadUserInfo.localId;
                        review.email=currentUser.reloadUserInfo.email;

                        console.log(review)

                        try{
                            document.getElementById('close-purchase-history').click();
                            await sendReview(review);
                            info('Review Success', 'Review submitted successfully');
                            await purchases_page();
                        } catch(e){
                            if(DEV) console.log(e);
                            info('Checkout Failed', JSON.stringify(e));
                        }
                    })
                });
            }

            modalTransaction.modal.show();
        })
    }
}

function buildReviewForm(pid){
let html=`
        <form method="post" id="submit-form-review">
            <input type="hidden" id="product-id" value=${pid}></input>
            <textarea id="feedback" placeholder="Comment"></textarea>
            <h2>Star Rating</h2>

            <div style="display:block;" class="rate">
                <input type="radio" id="star5" name="five" value="5" />
                <label id="stars-value5" for="star5" value="5" title="text">5</label>

                <input type="radio" id="star4" name="four" value="4" />
                <label id="stars-value4" for="star4" title="text">4</label>

                <input type="radio" id="star3" name="three" value="3" />
                <label id="stars-value3" for="star3" title="text">3</label>
                
                <input type="radio" id="star2" name="two" value="2" />
                <label id="stars-value2" for="star2" title="text">2</label>

                <input type="radio" id="star1" name="one" value="1"></input>
                <label id="stars-value1" for="star1" title="text">1</label>
            </div>
            <button style="display:block;" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>`
    return html;
}

function buildTransactionView(cart){

    let html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">Qty</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="50%">Summary</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
    `;

    cart.items.forEach(p => {
        html+=`
            <tr>
                <td><img src="${p.imageURL}"></td>
                <td>${p.name}</td>
                <td>${Util.currency(p.price)}</td>
                <td>${p.qty}</td>
                <td>${Util.currency(p.price * p.qty)}</td>
                <td>${p.summary}</td>
                <td>
                <form id="${p.pid}" class="form-review" method="post">
                    <input id="product-ID" value=${p.pid} type="hidden"></input>
                    <button type="button" style=${p.isReviewed? "display:none;" : "display:block;"} class="btn btn-primary" id="button-review">Review</button>
                </form>
                </td>
            </tr>
        `;
    });
    html +="</tbody></table>"
    html += `
        <div class="fs-3">Total: ${Util.currency(cart.getTotalPrice())}</div>
    `;  

    return html;
}


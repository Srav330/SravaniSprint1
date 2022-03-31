import { home_page } from '../viewpage/home_page.js';
import { purchases_page } from '../viewpage/purchases_page.js';
import { cart_page } from '../viewpage/cart_page.js';
import { profile_page } from '../viewpage/profile_page.js';
import { users_page } from "../viewpage/users_page.js";

export const ROUTE_PATHNAMES = {
    HOME: '/',
    PURCHASES: '/purchases',
    PROFILE: '/profile',
    CART: '/cart',
    USERS:'/user'
}

export const routes = [
    {pathname: ROUTE_PATHNAMES.HOME, page: home_page },
    {pathname: ROUTE_PATHNAMES.PURCHASES, page: purchases_page},
    {pathname: ROUTE_PATHNAMES.PROFILE, page: profile_page},
    {pathname: ROUTE_PATHNAMES.CART, page: cart_page},
    {pathname: ROUTE_PATHNAMES.USERS, page: users_page},

];

export function routing(pathname, hash){
    const r = routes.find(r => r.pathname == pathname);
    if(r) r.page();
    else routes[0].page();
}
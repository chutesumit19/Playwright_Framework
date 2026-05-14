import {APIRequestContext, expect} from '@playwright/test';

const Base_URL = "https://rahulshettyacademy.com/api/ecom";

export class APIHelper
{
    private request:APIRequestContext;
    private loginPayLoad:any;

    constructor(request:APIRequestContext, loginPayLoad:any)
    {
         this.request=request;
         this.loginPayLoad=loginPayLoad;
    }

   async getToken(): Promise<string>
    {
         const loginResponse = await this.request.post(`${Base_URL}/auth/login`, {
                  data: this.loginPayLoad
             });

             expect(loginResponse.ok()).toBeTruthy();
             const loginResponseBody = await loginResponse.json();
             const token:string = loginResponseBody.token;
             console.log("Response token is=", token);

             return token;
    }

    async createOrderId(orderPayload:any): Promise<string>
    {
     //Create orderID through API
     const orderResponse = await this.request.post(`${Base_URL}/order/create-order`, {
          data: orderPayload,
          headers: {
               'authorization': await this.getToken(),
               'Content-Type': "application/json; charset=utf-8"
          }
     })

       const orderResponseBody = await orderResponse.json();
       const orderId= orderResponseBody.orders[0];

       console.log("Order id is=", orderId);

       return orderId;


    }
}
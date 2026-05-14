import {expect, type Locator, type Page, BrowserContext} from '@playwright/test';
import { envConfig } from '../../../../../Playwright_Framework/playwright.config';
import { BasePage } from '../../../common/BasePage';
import testData from '../../../modules/login/UI/product-data.json';


export class ProductPage extends BasePage {

   // private readonly page:Page;
    private readonly userNameTB:Locator;
    private readonly passwordTB:Locator;
    private readonly loginBtn:Locator;
    private readonly allProductDetails:Locator;
    private readonly allProductTitles:Locator;

    userName:string = "";

    constructor(page:Page)
    {
        super(page);
        this.userNameTB = page.getByPlaceholder("email@example.com");
        this.passwordTB = page.getByPlaceholder("enter your passsword");
        this.loginBtn = page.getByRole('button',{name:"Login"});
        this.allProductDetails = page.locator(".card-body");
        this.allProductTitles = page.locator(".card-body b");
    }

    async launch(){
        var url= testData.ProductDetails.URL;
        await this.page.goto(url);
    }

    /*  //Launch the application using URL from envConfig
    async launchApplication(): Promise<void> {
        await this.page.goto(envConfig.URL);
        await this.page.waitForLoadState('networkidle');
    }

     //Login using credentials from envConfig
    async loginToApplication(): Promise<void> {
        const { username, pass } = envConfig.normalUser;
        await this.userNameTB.fill(username);
        await this.passwordTB.fill(pass);
        await this.loginBtn.click();
        await this.page.waitForLoadState('networkidle');
        this.userName = username;
    } */

    async loginToApp(userNamePass="",passwordPass="")
    {
        this.userName = userNamePass !="" ? userNamePass : testData.ProductDetails.USERNAME;
        const password = passwordPass !="" ? passwordPass : testData.ProductDetails.PASSWORD;

        await this.userNameTB.fill(this.userName);
        await this.passwordTB.fill(password);
        await this.loginBtn.click();

        await this.page.waitForLoadState('domcontentloaded');
    }


    async selectProduct(productName: string): Promise<void>
    {
         // ✅ Wait for loader to fully disappear
        await this.waitForLoaderToDisappear();
         // ✅ Wait for page to fully stabilize
        await this.page.waitForLoadState('networkidle');
        // ✅ Wait for cards to load first
        await this.page.locator(".card-body").first()
        .waitFor({ state: 'visible', timeout: 10000 });
        // ✅ Target by class - avoids all text/icon/spacing issues
        const addToCartBtn = this.page.locator(".card-body")
        .filter({ hasText: productName })
        .locator("button.btn.w-10");

       // ✅ Wait for button to be ready
        await expect(addToCartBtn).toBeVisible({ timeout: 8000 });
       await expect(addToCartBtn).toBeEnabled({ timeout: 8000 });
       // ✅ Step 5 - Wait for spinner to be completely gone before click
       await this.waitForLoaderToDisappear();
       await this.page.waitForTimeout(2000);
       // ✅ Step 6 - Use force click to bypass overlay interception
       await addToCartBtn.click({ force: true });
       // ✅ Step 7 - Wait for loader after click
       //await this.waitForLoaderToDisappear();
    }

}
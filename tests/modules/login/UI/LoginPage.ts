import {expect, type Locator, type Page, BrowserContext} from '@playwright/test';
import { envConfig } from '../../../../../Playwright_Framework/playwright.config';
import { BasePage } from '../../../common/BasePage';

export class LoginPage extends BasePage{
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
    
    //Launch the application using URL from envConfig
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
    }

}
import { Page, test as base } from '@playwright/test';
import { test as baseTest } from '../../../../tests/common/BaseFixture';
import { ProductPage } from '../../login/UI/ProductPage';
import { LoginPage } from '../../../modules/login/UI/LoginPage';
import { envConfig } from '../../../../playwright.config';


type ProductFixtures = {

    productPage: ProductPage,               // LoginPage is a CLASS, so use it directly as type ✅
    envConfig: typeof envConfig,       // envConfig is an OBJECT (not a class)
    // so use typeof to get its type ✅
}

export const test = base.extend<ProductFixtures>({

    envConfig: async ({ }, use: (fixture: typeof envConfig) => Promise<void>) => {
        await use(envConfig);
    },

    productPage: async ({page}:{page:Page}, use: (fixture : ProductPage)=>Promise<void>)=> {
         // ✅ Setup login here
         const loginPage = new LoginPage(page);
         await loginPage.launchApplication();
         await loginPage.loginToApplication();
         
        await use(new ProductPage(page));
      
    }
})

export { expect } from '@playwright/test';
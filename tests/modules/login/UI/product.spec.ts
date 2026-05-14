import { test, expect } from './ProductFixture';
import { ProductPage } from './ProductPage';
import { envConfig } from '../../../../playwright.config';
import testCasesTestData from './product-data.json';

//Run by Project Name (Best Practice) - npx playwright test --project=Login_tests
//Run multiple projects - npx playwright test --project=Login_tests --project=Payment_tests

/* test.beforeEach(async ({ productPage }) => {
       //await loginPage.launch(envConfig.URL);
       //await loginPage.launch();
       await productPage.launchApplication();
       await productPage.loginToApplication();
}); */

/*  test.afterEach(async ({ page, productPage })=>{
    await page.close();                     
    await page.context().close(); 

});  */

test('[TC_001]: Verify Product should be added in cart', async ({ page, productPage }, testInfo) => {
       try {
             await test.step('Step 1: Select a product and add into cart',async() =>{
              await productPage.selectProduct(testCasesTestData.ProductDetails.Adidas);
              //await productPage.verifyToasterMessage('Product Added To Cart');
              await page.getByRole("listitem").getByRole('button', { name: "Cart" }).click({ timeout: 8000 });
              });

              
              await test.step('Step 2: Verify added product should be shown in cart',async()=>{
              await page.locator("div li").first().waitFor();
              await expect(page.getByText(testCasesTestData.ProductDetails.Adidas)).toBeVisible();

              });

       } catch (error) {
            console.error('Error in test [TC_001]:', error);
            throw error;
            //testInfo.status = 'failed';
       }
});

test('[TC_002]: Verify cart body items', async ({page, productPage}, testInfo)=>{
       try{
       await test.step('Step 1: Verify all the titles', async()=>{
              await page.locator(".card-body b").first().waitFor();
              const titles = await page.locator(".card-body b").allTextContents();
             console.log(titles); 
             });
       }
       catch(error){
            console.error('Error in test [TC_002]', error);
            //throw error;
            testInfo.status = 'failed';
       }
});

test('[TC_003]: Verify search option is available', async ({page, productPage}, testInfo)=>{
       try{
       await test.step('Step 1: Verify search option is available in Home Page', async()=>{
              await page.waitForTimeout(2000);
             const search = page.getByPlaceholder('search').first();
             await expect(search).toBeEnabled();
             });
       }
       catch(error){
            console.error('Error in test [TC_003]', error);
            //throw error;
            testInfo.status = 'failed';
       }


});


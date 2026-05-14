import { test as base, Page, BrowserContext } from '@playwright/test';

type BaseFixtures = {
     context: BrowserContext;
     page:Page;

}

export const test = base.extend<BaseFixtures>({
    
    //Override the built-in context fixture
    context: async ({ browser }, use) => {
        const context = await browser.newContext({
            viewport: null,
        });

        await use(context);     // ✅ Test runs

        await context.close();  // ✅ Auto closes context after every test
    },

    //Override the built-in page fixture
    page: async ({ context }, use) => {
        const page = await context.newPage();

        await use(page);        // ✅ Test runs
        await page.close();     // ✅ Auto closes page after every test
    },
});

export { expect } from '@playwright/test';
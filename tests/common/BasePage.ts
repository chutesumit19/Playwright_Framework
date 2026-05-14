import { Page, expect, Locator } from '@playwright/test';

export class BasePage {

    protected readonly page: Page;
    private readonly toasterAddToCart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toasterAddToCart = page.getByText("Product Added To Cart'"); // ✅ update with your locator
    }

    // ✅ Reusable across ALL pages
    async verifyToasterMessage(expectedMessage: string): Promise<void> {
        await expect(this.toasterAddToCart).toBeVisible({ timeout: 5000 });
        await expect(this.toasterAddToCart).toBeEnabled({ timeout: 5000 });
        const actualMessage = await this.toasterAddToCart.innerText();
        expect(actualMessage).toBe(expectedMessage);
        //await expect(this.toasterAddToCart).toBeHidden({ timeout: 12000 });
    }

    async waitForLoaderToDisappear(): Promise<void> {
        const spinner = this.page.locator('.ngx-spinner-overlay');
        // ✅ Wait for spinner to appear first (it may not have triggered yet)
        try {
            await spinner.waitFor({ state: 'visible', timeout: 3000 });
        } catch {
            // spinner never appeared - that is fine, continue
        }

      /*   // ✅ Then wait for it to disappear
        try {
            await spinner.waitFor({ state: 'hidden', timeout: 10000 });
        } catch {
            // spinner already gone - that is fine, continue
        } */
    }
}
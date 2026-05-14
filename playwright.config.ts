import { defineConfig, devices } from '@playwright/test';
import {qaprodca} from './tests/common/env/Qaprodca';
import {alphaprodca} from './tests/common/env/Alphaprodca';
import * as dotenv from 'dotenv';       //npm install --save-dev dotenv @types/node
import * as path from 'path';
import { AzureReporterOptions } from '@alex_neo/playwright-azure-reporter';

//Load environment variables from .env file if available
dotenv.config();

const buildName = `iFirm Playwright Tests - ${new Date().toISOString().split('T')[0]}`;
const getTimestamp = () => new Date().toISOString().replace(/[:.-T]/g, "").split(".")[0];
const timestamp = getTimestamp();

const environmentConfigs: {[key:string]: any} = {

      "qaprodca": qaprodca,
      "alphaprodca": alphaprodca
}

export const environment = process.env.ENVIRONMENT || 'alphaprodca';
export const envConfig = environmentConfigs[environment.toLowerCase()];

const reportFolder = path.resolve(`Playwright-report/Report-${timestamp}_${environment}`);

/**
 * Returns the report output folder path that matches the HTML reporter configuration
 * This ensures CSV files are saved to the same folder as the HTML report
 */
export function getReportOutputFolder(): string {
  return reportFolder;
}

export default defineConfig({
  testDir: './tests',

  //Only run test files matching these patterns
  testMatch:[
    'tests/modules/**/*.spec.ts',
    'tests/examples/**/*.spec.ts'
  ],
  timeout:180000,
  expect:{
    timeout:30000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  retries: 0,

  //Stores: screenshots/traces/logs
  outputDir: 'TestResults/Output',
  workers: 4,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [
  ['html', { open: 'always', outputFolder: reportFolder }],
  ['junit', { outputFile: `test-results/e2e-junit-results-${timestamp}.xml` }],
  ['json', { outputFile: 'test-results/report.json' }],
//  ['./src/utils/excelSummaryReporter.ts'],
 /*  [
    '@alex_neo/playwright-azure-reporter',      //Azure DevOps reporter (Most Imp)
    {
      orgUrl: 'https://dev.azure.com/ifirm',
      token: process.env.AZURE_TOKEN,
      planId: 73640,
      projectName: 'iFirm',
      environment: 'QA',
      logging: false,
      testRunTitle: 'Playwright Test Run',
      publishTestResultsMode: 'testRun',
      uploadAttachments: true,
      attachmentsType: ['screenshot', 'video', 'trace'],
      testRunConfig: {
      owner: {

      },
  comment: 'Playwright Test Run',
  // the configuration ids of this test run, use
  // https://dev.azure.com/ifirm/iFirm/_testManagement/configurations to get the ids of your project.
  // E.g AU-CaaS --> 16 , CA-Region --> 6 , iCare -->5 etc
  // if multiple configuration ids are used in one run a testPointMapper should be used to pick the correct one
  // otherwise the results are pushed to all.
  configurationIds: [5],
},
} as AzureReporterOptions, 
 ] */
],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    defaultBrowserType: "chromium",
    actionTimeout: 25000,
    ignoreHTTPSErrors: true    //Ignores SSL certificate errors
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'loginSetup',
      testMatch: 'auth.setup.ts',
      testDir: 'tests/'
    },
    {
      name: 'chromium',
      use: { 
        viewport: null,
        launchOptions:{
          args: ["--start-maximized"]
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Product_tests',         //Run by Project Name (Best Practice) - npx playwright test --project=Product_tests
      testDir: './tests/modules/login/UI/',
      testMatch: '**/product.spec.ts',
      timeout: 1 * 60 * 1000,
      use:{
        channel: 'chrome',
        //browserName: 'chromium',
        navigationTimeout: 150000,
        actionTimeout: 150000,
        headless: false,
        viewport: null,
        launchOptions:{
          args: ["--start-maximized"]
        },
      },
    },

  ],

});

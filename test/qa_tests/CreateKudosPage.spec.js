//all tests for create kudos page
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  //login before each test
  await page.goto('http://localhost:3000/home');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('user@example.com');
  await page.getByRole('button', { name: 'Login' }).click();
});

test('CK1- test open create kudo page', async ({ page, context }) => {
  //navigate to create kudo page, verify everything is visible
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL('http://localhost:3000/studentView/new-kudos');
  await expect(page.getByLabel('Recipient')).toBeVisible();
  await expect(page.getByText('Your Message')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your Message' })).toBeVisible();
  await expect(page.getByText('Well Done!Nice Job!Great Work!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send Kudo' })).toBeVisible();
});

test('CK2- test input validation with empty fields', async ({ page, context }) => {
  //try to submit with empty fields, verify error messages
  await page.getByRole('button', { name: 'Create' }).click();
  //no selection with class dropdown
  await page.getByLabel('Select a Class').selectOption('');
  await page.getByRole('button', { name: 'Send Kudo' }).click();
  await expect(page).toHaveURL('http://localhost:3000/studentView/new-kudos');

  //no selection with recipient dropdown
  await page.getByLabel('Select a Class').selectOption('2f510eb1-ac18-4a4b-8040-774f2429c747');
  await page.getByRole('button', { name: 'Send Kudo' }).click();
  await expect(page).toHaveURL('http://localhost:3000/studentView/new-kudos');

  //no text in message box
  await page.getByLabel('Recipient').selectOption('23768d81-e9bd-47bb-ab82-6ae47cea58f8');
  await page.getByLabel('Select a Class').selectOption('2f510eb1-ac18-4a4b-8040-774f2429c747');
  await page.getByRole('button', { name: 'Send Kudo' }).click();
  await expect(page).toHaveURL('http://localhost:3000/studentView/new-kudos');
});

test('CK3- Character limit > 500 when typing', async ({ page, context }) => {
  //Type >500 chars into textbox
  const longText = 'a'.repeat(600);
  await page.goto('http://localhost:3000/home');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('user@example.com');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Create' }).dblclick();
  await page.getByRole('textbox', { name: 'Your Message' }).click();
  await page.getByRole('textbox', { name: 'Your Message' }).fill(longText);
  const value = await page.getByRole('textbox', { name: 'Your message'}).inputValue();
  expect(value.length).toBe(500);
  await expect(page.getByText('/500')).toHaveText('500/500');
});

test('CK4- Pasted text > 500 should be trimmed to 500', async ({ page, context }) => {
  //test Ctrl+V paste into textbox
  const longText = 'a'.repeat(600);
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('textbox', { name: 'Your Message' }).click();
  await page.locator('textbox').focus();
  await page.evaluate(() => navigator.clipboard.writeText(longText))
  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardContent = await handle.jsonValue();
   await page.locator('textbox').press('Meta+v');
  
  //Assert that the character count shows 500/500
  await expect(page.getByText('/500')).toHaveText('500/500'); 
});

test('CK5', async ({ page, context }) => {
  //try submit message <10 chars
  await page.getByRole('button', { name: 'Create' }).dblclick();
  await page.getByLabel('Recipient').selectOption('23768d81-e9bd-47bb-ab82-6ae47cea58f8');
  await page.getByRole('textbox', { name: 'Your Message' }).click();
  await page.getByRole('textbox', { name: 'Your Message' }).fill('shortmsg');
  await page.getByRole('button', { name: 'Send Kudo' }).click();
  //shouldnt redirect if msg char <10
  await expect(page).toHaveURL('http://localhost:3000/studentView/new-kudos');
});

test('CK6', async ({ page, context }) => {
  //test recipient dropdown
  await page.getByRole('button', { name: 'Create' }).click();
  //test user uuid for dropdown
  await page.getByLabel('Recipient').selectOption('23768d81-e9bd-47bb-ab82-6ae47cea58f8');
  await page.getByLabel('Recipient').selectOption('');
});

test('CK7', async ({ page, context }) => {
  //Test cancelling/clicking home button mid-entry
});

test('CK8', async ({ page, context }) => {
  //test page resizing
});

test('CK9', async ({ page, context }) => {
  //Test card design selection; should be 3 images to choose from
});

test('CK10', async ({ page, context }) => {
  
});

test('CK11', async ({ page, context }) => {
  
});

test('CK12', async ({ page, context }) => {
  
});
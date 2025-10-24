import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('No received Kudos yet.').click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Discard' }).click();
});
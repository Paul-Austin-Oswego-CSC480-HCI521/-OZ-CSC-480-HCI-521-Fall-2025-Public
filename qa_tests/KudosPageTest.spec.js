import { test, expect } from '@playwright/test';

// Page loads with form fields visible (recipient, message, title, submit button).
test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Student' }).click();
  await page.getByRole('button', { name: 'Create' }).click();

  //assert that input fields/buttons are visible
  await expect(page.getByLabel('Recipient')).toBeVisible();
  await expect(page.getByText('Your Message')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your Message' })).toBeVisible();
  await expect(page.getByText('Well Done!Nice Job!Great Work!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send Kudo' })).toBeVisible();
});    
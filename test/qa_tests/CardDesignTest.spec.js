import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Student' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Well Done!' }).click();
  await page.getByRole('img', { name: 'Well Done!' }).click();
  await page.getByRole('button', { name: 'Nice Job!' }).click();
  await page.getByRole('img', { name: 'Nice Job!' }).click();
  await page.getByRole('button', { name: 'Great Work!' }).click();
  await page.getByRole('img', { name: 'Great Work!' }).click();
  await page.getByRole('button', { name: 'Thank you!' }).click();
  await page.getByRole('img', { name: 'Thank you!' }).click();
  
  await page.getByRole('button', { name: 'Great Work!' }).click();
});
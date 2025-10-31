import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/studentView');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Send Kudo' }).click();
  await page.getByRole('textbox', { name: 'Your Message' }).click();
  await page.getByRole('textbox', { name: 'Your Message' }).fill('In an era defined by rapid technological shifts and evolving social paradigms, it becomes increasingly vital to understand the underlying mechanisms that drive change. By leveraging a holistic approach that integrates both quantitative metrics and qualitative insights, stakeholders can better anticipate trends, optimize strategies, and foster sustainable growth. This dynamic interplay between innovation, adaptation, and proactive engagement shapes the landscape of modern enterprise and society.s');
  await page.getByRole('textbox', { name: 'Your Message' }).click();
  await page.getByRole('button', { name: 'Great Work!' }).click();
  await page.getByRole('button', { name: 'Nice Job!' }).click();
  await page.getByRole('button', { name: 'Well Done!' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
});

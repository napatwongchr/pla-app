import { test, expect } from '@playwright/test'

test.describe('Topics page', () => {
  test('สร้าง topic สำเร็จ → ปรากฏในรายการ', async ({ page }) => {
    const topicTitle = `Test Topic ${Date.now()}`

    // 1. เปิดหน้า /topics
    await page.goto('/topics')

    // 2. คลิกปุ่มสร้าง topic ใหม่
    await page.getByTestId('create-topic-button').click()

    // 3. กรอกชื่อ topic
    await page.getByTestId('topic-title-input').fill(topicTitle)

    // 4. กด Save
    await page.getByRole('button', { name: 'Save' }).click()

    // 5. ตรวจสอบว่า topic ที่สร้างปรากฏในรายการ
    const topicCard = page
      .getByTestId('topic-card')
      .filter({ hasText: topicTitle })

    await expect(topicCard).toBeVisible()
  })
})

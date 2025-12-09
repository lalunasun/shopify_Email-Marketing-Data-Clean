import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Batch import CSV files to Shopify with tag and segment rename', async ({ page }) => {
  test.setTimeout(14400000); // 4 hours

  const csvDir = path.join(__dirname, 'csv_folder_camps');
  const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

  // 登录 Shopify
  await page.goto('https://www.shopify.com/ca');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('good.plans@outlook.com');
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Addprint');
  await page.getByRole('button', { name: 'Log in' }).click();

  // 进入商店后台并打开 Customers 页面
  //await page.goto('https://admin.shopify.com/store/mejjty-5w?ui_locales=en-CA&country=CA');
  await page.getByRole('link', { name: 'Customers' }).click();

  for (const file of files) {
    const filePath = path.join(csvDir, file);
    const tagFromFilename = path.basename(file, '.csv');

    console.log(`📥 正在导入: ${file}, Tag: ${tagFromFilename}`);

    try {
      // 打开 Import 弹窗
      await page.getByRole('button', { name: 'Import' }).click();

      // 上传文件
      await page.setInputFiles('input[type="file"]', filePath);

      // 勾选导入选项
      await page.getByRole('checkbox', { name: 'Overwrite existing customers' }).check();
      await page.getByRole('checkbox', { name: 'Add tags to customers in this' }).check();

      // 添加 tag（使用文件名）
      await page.getByRole('combobox', { name: 'Find or create tags' }).click();
      await page.getByRole('combobox', { name: 'Find or create tags' }).fill(tagFromFilename);
      await page.getByText(`Add ${tagFromFilename}`).click();

      // 点击导入按钮
      await page.getByRole('button', { name: 'Import customers' }).click();

      // 等待导入完成提示出现
      await page.waitForSelector('text=Successfully imported', { timeout: 480000 });

      // 点击“View segment”进入自动生成的 Segment 页面
      await page.getByRole('button', { name: 'View segment' }).click();

      // 点击更多操作 > 重命名
      await page.getByRole('button', { name: 'More actions' }).click();
      await page.getByRole('button', { name: 'Rename', exact: true }).click();
      await page.getByRole('textbox', { name: 'Segment name' }).click();
      await page.getByRole('textbox', { name: 'Segment name' }).fill(tagFromFilename);
      await page.getByRole('button', { name: 'Save' }).click();

      // 返回 Customers 页面，准备处理下一个
      await page.getByRole('link', { name: 'Customers', exact: true }).click();

      console.log(`✅ 已成功导入并重命名 segment: ${tagFromFilename}`);
    } catch (err) {
      console.error(`❌ 导入失败: ${file}`, err);
    }
  }

  console.log('🎉 所有文件已处理完成！');
});

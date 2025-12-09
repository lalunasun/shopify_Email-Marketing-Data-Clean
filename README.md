# Shopify Email Marketing Data Clean

This repository contains a small workflow to **clean Shopify email marketing data** and **automate CSV import into Shopify**.

The process has two main parts:

1. **R scripts** – clean and prepare an email list for marketing  
2. **Playwright script** – batch import the cleaned CSV files into Shopify

---

## 1. Workflow Overview

**Data flow**

1. Export email activity from Shopify (e.g., `CA_opened.csv`)
2. Export / maintain a suppression list (`filter.csv`)  
   - Unsubscribed  
   - Bounced  
   - Marked as spam  
3. Use R to:
   - Remove all emails that appear in the suppression list  
   - Split the final list into multiple CSV files (e.g., 1000 rows per file)
4. Use Playwright to open Shopify Admin in a browser and import each CSV file.

## 2. R Scripts – Data Cleaning & Splitting

### 2.1 Dependencies

Make sure you have R installed and the following packages:

```r
install.packages(c("dplyr", "readr", "tidyr"))

Playwright – Batch Import CSV Files to Shopify
Node.js installed
Playwright installed in the project

Run the test
From the project root, run:
npx playwright test shopify_import.spec.js

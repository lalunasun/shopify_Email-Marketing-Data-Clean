library(dplyr)
library(readr)

# Read the dataset containing all "opened" email activity.
# This file represents customers who opened your recent email campaigns.
merged_data <- read_csv('C:/shopify-filter/CA_opened.csv')
View(merged_data)

# Read the historical suppression list.
# This filter file contains email addresses that previously:
# - Unsubscribed
# - Bounced
# - Marked emails as spam
# The purpose is to exclude these contacts from future marketing activities.
filter_data <- read_csv("C:/shopify-filter/filter.csv", show_col_types = FALSE) %>%
  select(Email) %>%        # Keep only the Email column
  distinct()               # Remove duplicate email entries

# Remove all contacts who appear in the suppression list.
# Essentially: "opened data" MINUS "unsub + bounce + spam" records.
cleaned_data <- anti_join(merged_data, filter_data, by = "Email")
View(cleaned_data)

# Count total records before and after filtering
total_before <- nrow(merged_data)
total_after <- nrow(cleaned_data)

cat("Total records before filtering: ", total_before, "\n")
cat("Remaining after filtering: ", total_after, "\n")

# Optional: Add a new column to indicate marketing acceptance
# df_final <- cleaned_data %>%
#   mutate(`Accepts email Marketing` = "yes")

# Save the final cleaned dataset
write.csv(cleaned_data,
          file = "C:/邮件总/CA邮件筛选/CA_1209/CA_opened-1209.csv",
          row.names = FALSE,
          fileEncoding = "UTF-8")


import sequelize from "@/lib/Sequelize";
import { LineItem } from "@/models/Dynamic/DynamicModel";
import { TextInputRecord, NumberInputRecord, LookupInputRecord, LongTextInputRecord, DateInputRecord, CheckboxInputRecord } from "@/models/Dynamic/Records";

const TEMP_ENTERED_BY_USER_ID = "c3508cda-6808-43f8-86f1-5415fc3643a5";

export async function updateEnteredByForExistingRecords() {
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    await LineItem.update(
      { enteredBy: TEMP_ENTERED_BY_USER_ID },
      { where: { enteredBy: null }, transaction }
    )
    await transaction.commit(); // ✅ Commit if everything succeeds
    console.log("All enteredBy fields updated successfully.");
  } catch (error) {
    await transaction.rollback(); // ❌ Rollback if any error happens
    console.error("Failed to update enteredBy fields:", error);
    throw error; // rethrow for logging upstream if needed
  }
}

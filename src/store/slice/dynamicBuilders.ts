// dynamicBuilders.ts
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  getDynamicModels,
  addDynamicModel,
  editDynamicModel,
  deleteDynamicModel,
  addInputFieldToModel,
  deleteDynamicField,
  addLineItem,
  getLineItem,
  removeLineItemAction,
  editDynamicFieldAction,
  editFormLayout,
  addRecordLayout,
  deleteRecordLayout,
  editRecordLayout,
  fetchFormLayouts, addFormLayout, deleteFormLayout, fetchRecordLayouts,// You can later import record thunks here
  fetchAllRecordLayouts,
  editLineItem
} from "./dynamicThunks";

import { TField, TLineItem, TRecord } from "@/types/dynamicModel";
import { DynamicModelState } from "./dynamicModelSlice";

// ---------------------
// 🧱 MODEL BUILDER
// ---------------------
export const modelBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(getDynamicModels.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getDynamicModels.fulfilled, (state, action) => {
      state.loading = false;
      state.dynamicModels = action.payload;
    })
    .addCase(getDynamicModels.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch models";
    })

    .addCase(addDynamicModel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addDynamicModel.fulfilled, (state, action) => {
      state.loading = false;
      state.dynamicModels.push(action.payload);
    })
    .addCase(addDynamicModel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add model";
    })

    .addCase(editDynamicModel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editDynamicModel.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.dynamicModels.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.dynamicModels[index] = action.payload;
      }
    })
    .addCase(editDynamicModel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to edit model";
    })

    .addCase(deleteDynamicModel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteDynamicModel.fulfilled, (state, action) => {
      state.loading = false;
      state.dynamicModels = state.dynamicModels.filter((m) => m.id !== action.payload);
      if (state.selectedModel?.id === action.payload) {
        state.selectedModel = null;
      }
    })
    .addCase(deleteDynamicModel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete model";
    });
};

// ---------------------
// 📋 FIELD BUILDER
// ---------------------
export const fieldBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(deleteDynamicField.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteDynamicField.fulfilled, (state, action) => {
      state.loading = false;
      const fieldId = action.payload;

      const fieldKeys = [
        "ModelTextInputs",
        "ModelNumberInputs",
        "ModelDateInputs",
        "ModelLongTextInputs",
        "ModelCheckboxInputs",
        "ModelLookupInputs",
      ] as const;

      state.dynamicModels = state.dynamicModels.map((model) => {
        const updated = { ...model };
        fieldKeys.forEach((key) => {
          if (updated[key]) {
            updated[key] = (updated[key] as any[]).filter((f) => f.id !== fieldId);
          }
        });
        return updated;
      });

      if (state.selectedModel) {
        const updated = { ...state.selectedModel };
        fieldKeys.forEach((key) => {
          if (updated[key]) {
            updated[key] = (updated[key] as any[]).filter((f) => f.id !== fieldId);
          }
        });
        state.selectedModel = updated;
      }
    })
    .addCase(deleteDynamicField.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete field";
    });
};

// ---------------------
// ➕ ADD FIELD BUILDER
// ---------------------
export const addFieldBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(addInputFieldToModel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addInputFieldToModel.fulfilled, (state, action) => {
      state.loading = false;
      const field = action.payload as TField & { modelId: string };
      console.log(field)
      const modelIndex = state.dynamicModels.findIndex(m => m.id === field.modelId);
      if (modelIndex === -1) return;

      const model = { ...state.dynamicModels[modelIndex] };

      switch (field.type) {
        case "text":
          model.ModelTextInputs = [...(model.ModelTextInputs ?? []), field as any];
          break;
        case "number":
          model.ModelNumberInputs = [...(model.ModelNumberInputs ?? []), field as any];
          break;
        case "date":
          model.ModelDateInputs = [...(model.ModelDateInputs ?? []), field as any];
          break;
        case "longText":
          model.ModelLongTextInputs = [...(model.ModelLongTextInputs ?? []), field as any];
          break;
        case "checkbox":
          model.ModelCheckboxInputs = [...(model.ModelCheckboxInputs ?? []), field as any];
          break;
        case "lookup":
          model.ModelLookupInputs = [...(model.ModelLookupInputs ?? []), field as any];
          break;
      }
      state.dynamicModels[modelIndex] = model;
      if (state.selectedModel?.id === field.modelId) {
        state.selectedModel = model;
        state.inputFields = [
          ...(model.ModelTextInputs ?? []).map(f => ({ ...f, type: "text" as const })),
          ...(model.ModelNumberInputs ?? []).map(f => ({ ...f, type: "number" as const })),
          ...(model.ModelDateInputs ?? []).map(f => ({ ...f, type: "date" as const })),
          ...(model.ModelLongTextInputs ?? []).map(f => ({ ...f, type: "longText" as const })),
          ...(model.ModelCheckboxInputs ?? []).map(f => ({ ...f, type: "checkbox" as const })),
          ...(model.ModelLookupInputs ?? []).map(f => ({ ...f, type: "lookup" as const })),
        ];
      }
    })
    .addCase(addInputFieldToModel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add input field";
    });
};


export const editFieldBuilder = (
  builder: ActionReducerMapBuilder<DynamicModelState>
) => {
  builder
    .addCase(editDynamicFieldAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editDynamicFieldAction.fulfilled, (state, action) => {
      state.loading = false;
      const updatedField = action.payload as TField & { modelId: string };
      const modelIndex = state.dynamicModels.findIndex(
        (m) => m.id === updatedField.modelId
      );
      if (modelIndex === -1) return;

      const model = { ...state.dynamicModels[modelIndex] };

      const updateFieldList = <T extends TField>(
        list: T[] | undefined,
        updated: T
      ): T[] => {
        if (!list) return [updated];
        const index = list.findIndex((f) => f.id === updated.id);
        if (index === -1) return [...list, updated];
        const newList = [...list];
        newList[index] = updated;
        return newList;
      };

      switch (updatedField.type) {
        case "text":
          model.ModelTextInputs = updateFieldList(
            model.ModelTextInputs,
            updatedField as any
          );
          break;
        case "number":
          model.ModelNumberInputs = updateFieldList(
            model.ModelNumberInputs,
            updatedField as any
          );
          break;
        case "date":
          model.ModelDateInputs = updateFieldList(
            model.ModelDateInputs,
            updatedField as any
          );
          break;
        case "longText":
          model.ModelLongTextInputs = updateFieldList(
            model.ModelLongTextInputs,
            updatedField as any
          );
          break;
        case "checkbox":
          model.ModelCheckboxInputs = updateFieldList(
            model.ModelCheckboxInputs,
            updatedField as any
          );
          break;
        case "lookup":
          model.ModelLookupInputs = updateFieldList(
            model.ModelLookupInputs,
            updatedField as any
          );
          break;
      }

      state.dynamicModels[modelIndex] = model;

      // Also update selectedModel and inputFields
      if (state.selectedModel?.id === updatedField.modelId) {
        state.selectedModel = model;
        state.inputFields = [
          ...(model.ModelTextInputs ?? []).map((f) => ({ ...f, type: "text" as const })),
          ...(model.ModelNumberInputs ?? []).map((f) => ({ ...f, type: "number" as const })),
          ...(model.ModelDateInputs ?? []).map((f) => ({ ...f, type: "date" as const })),
          ...(model.ModelLongTextInputs ?? []).map((f) => ({ ...f, type: "longText" as const })),
          ...(model.ModelCheckboxInputs ?? []).map((f) => ({ ...f, type: "checkbox" as const })),
          ...(model.ModelLookupInputs ?? []).map((f) => ({ ...f, type: "lookup" as const })),
        ];
      }
    })
    .addCase(editDynamicFieldAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update input field";
    });
};

// ---------------------
// 📁 RECORD BUILDER (WIP / placeholder)
// ---------------------
export const recordBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(addLineItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addLineItem.fulfilled, (state, action) => {
      state.loading = false;
      const newModel = action.payload;
      state.selectedLineItem = [...state.selectedLineItem ?? [], newModel]
    })
    .addCase(addLineItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add record";
    })
    .addCase(getLineItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getLineItem.fulfilled, (state, action) => {
      state.loading = false;
      const incoming = action.payload;
      const existing = state.selectedLineItem ?? []
      const mergedMap = new Map<string, TLineItem>();
      for (const item of existing) {
        mergedMap.set(item.id, item);
      }
      for (const item of incoming) {
        mergedMap.set(item.id, item);
      }
      state.selectedLineItem = Array.from(mergedMap.values());
    })
    .addCase(getLineItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add record";
    })
    .addCase(removeLineItemAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeLineItemAction.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedLineItem = state.selectedLineItem?.filter((m) => m.id !== action.payload) ?? []
    })
    .addCase(removeLineItemAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add record";
    })
    .addCase(editLineItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editLineItem.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      if (!updated?.id) return;
      state.selectedLineItem = (state.selectedLineItem ?? []).map(item =>
        item.id === updated.id ? { ...item, fields: updated.fields } : item
      );
    })
    .addCase(editLineItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update record";
    })

};

export const FormlayoutBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(fetchFormLayouts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchFormLayouts.fulfilled, (state, action) => {
      state.loading = false;
      const newLayouts = action.payload;
      const merged = [...state.formLayouts.filter(existing => !newLayouts.some(newItem => newItem.id === existing.id)), ...newLayouts];
      state.formLayouts = merged;
    })
    .addCase(fetchFormLayouts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch form layouts";
    })

    // ✅ Add Form Layout
    .addCase(addFormLayout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addFormLayout.fulfilled, (state, action) => {
      state.loading = false;
      state.formLayouts.push(action.payload);
    })
    .addCase(addFormLayout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add form layout";
    })

    // ✅ Delete Form Layout
    .addCase(deleteFormLayout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteFormLayout.fulfilled, (state, action) => {
      state.loading = false;
      state.formLayouts = state.formLayouts.filter(l => l.id !== action.payload);
    })
    .addCase(deleteFormLayout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete form layout";
    })

    .addCase(editFormLayout.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.formLayouts.findIndex((l) => l.id === updated.id);
      if (index !== -1) {
        state.formLayouts[index] = updated;
      }
    });
};


export const RecordlayoutBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  builder
    .addCase(fetchAllRecordLayouts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllRecordLayouts.fulfilled, (state, action) => {
      state.loading = false;
      const newLayouts = action.payload;
      const merged = [...state.recordLayouts.filter(existing => !newLayouts.some(newItem => newItem.id === existing.id)), ...newLayouts];
      state.recordLayouts = merged;
    })
    .addCase(fetchAllRecordLayouts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch record layouts";
    })

    .addCase(addRecordLayout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addRecordLayout.fulfilled, (state, action) => {
      state.loading = false;
      state.recordLayouts.push(action.payload);
    })
    .addCase(addRecordLayout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add record layout";
    })

    .addCase(deleteRecordLayout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteRecordLayout.fulfilled, (state, action) => {
      state.loading = false;
      state.recordLayouts = state.recordLayouts.filter(l => l.id !== action.payload);
    })
    .addCase(deleteRecordLayout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete record layout";
    })

    .addCase(editRecordLayout.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.recordLayouts.findIndex((l) => l.id === updated.id);
      if (index !== -1) {
        state.recordLayouts[index] = updated;
      }
    })

};

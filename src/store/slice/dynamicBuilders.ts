// dynamicBuilders.ts
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  getDynamicModels,
  addDynamicModel,
  editDynamicModel,
  deleteDynamicModel,
  addInputFieldToModel,
  deleteDynamicField,
  // You can later import record thunks here
} from "./dynamicThunks";

import { TField } from "@/types/dynamicModel";
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
      const model = state.dynamicModels.find((m) => m.id === field.modelId);
      if (!model) return;
      if (state.selectedModel?.id === field.modelId) {
        state.selectedModel = model;
      }

      switch (field.type) {
        case "text":
          model.ModelTextInputs ??= [];
          model.ModelTextInputs.push(field as any);
          break;
        case "number":
          model.ModelNumberInputs ??= [];
          model.ModelNumberInputs.push(field as any);
          break;
        case "date":
          model.ModelDateInputs ??= [];
          model.ModelDateInputs.push(field as any);
          break;
        case "longText":
          model.ModelLongTextInputs ??= [];
          model.ModelLongTextInputs.push(field as any);
          break;
        case "checkbox":
          model.ModelCheckboxInputs ??= [];
          model.ModelCheckboxInputs.push(field as any);
          break;
      }
    })
    .addCase(addInputFieldToModel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add input field";
    });
};

// ---------------------
// 📁 RECORD BUILDER (WIP / placeholder)
// ---------------------
export const recordBuilder = (builder: ActionReducerMapBuilder<DynamicModelState>) => {
  // Add later: fetch records, add/edit/delete records, etc.
};


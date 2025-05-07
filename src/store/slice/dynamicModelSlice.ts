// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TField, TDynamicModel, TRecord, TLineItem } from "@/types/dynamicModel";
import { addFieldBuilder, editFieldBuilder, fieldBuilder, FormlayoutBuilder, modelBuilder, recordBuilder, RecordlayoutBuilder } from "./dynamicBuilders";
import { TFormLayout, TRecordLayout } from "@/types/layouts";

export interface DynamicModelState {
  dynamicModels: TDynamicModel[];
  inputFields: TField[];
  allFields: TField[];
  records: TRecord[];
  formLayouts: TFormLayout[];
  recordLayouts: TRecordLayout[];
  selectedLineItem: TLineItem[] | null;
  lineItems: TLineItem[] | [];
  selectedModel: TDynamicModel | null;
  selectedField: TField | null;
  selectedRecord: TRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: DynamicModelState = {
  dynamicModels: [],
  inputFields: [],
  allFields: [],
  records: [],
  lineItems: [],
  formLayouts: [],
  recordLayouts: [],
  selectedLineItem: null,
  selectedModel: null,
  selectedField: null,
  selectedRecord: null,
  loading: false,
  error: null,
};

export function flattenModelFields(model: TDynamicModel): TField[] {
  return [
    ...(model.ModelTextInputs?.map(f => ({ ...f, type: 'text' as const })) || []),
    ...(model.ModelNumberInputs?.map(f => ({ ...f, type: 'number' as const })) || []),
    ...(model.ModelDateInputs?.map(f => ({ ...f, type: 'date' as const })) || []),
    ...(model.ModelLongTextInputs?.map(f => ({ ...f, type: 'longText' as const })) || []),
    ...(model.ModelCheckboxInputs?.map(f => ({ ...f, type: 'checkbox' as const })) || []),
    ...(model.ModelLookupInputs?.map(f => ({ ...f, type: 'lookup' as const })) || []),
  ]
}


export const dynamicModelSlice = createSlice({
  name: "dynamicModels",
  initialState,
  reducers: {
    setSelectedModel(state, action: PayloadAction<TDynamicModel | null>) {
      state.selectedModel = action.payload;
      state.inputFields = action.payload ? flattenModelFields(action.payload) : []
    },
    setAllFields(state) {
      state.allFields = state.dynamicModels.flatMap(model => flattenModelFields(model));
    },
    setSelectedField(state, action: PayloadAction<TField | null>) {
      const field = action.payload;
      if (!field || !state.selectedModel) {
        state.selectedField = null;
        return;
      }
      const allFields = [
        ...(state.selectedModel.ModelTextInputs || []),
        ...(state.selectedModel.ModelNumberInputs || []),
        ...(state.selectedModel.ModelDateInputs || []),
        ...(state.selectedModel.ModelLongTextInputs || []),
        ...(state.selectedModel.ModelCheckboxInputs || []),
        ...(state.selectedModel.ModelLookupInputs || []),
      ];
      const matched = allFields.find(f => f.id === field.id);
      state.selectedField = matched ? ({ ...matched, type: field.type } as TField) : null;
    },
  },
  extraReducers: (builder) => {
    editFieldBuilder(builder);
    modelBuilder(builder);
    fieldBuilder(builder);
    addFieldBuilder(builder);
    recordBuilder(builder);
    FormlayoutBuilder(builder);
    RecordlayoutBuilder(builder);
  },
});

export const { setSelectedModel, setSelectedField, setAllFields } = dynamicModelSlice.actions;
export default dynamicModelSlice.reducer;

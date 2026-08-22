import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark" | "system";

type UiState = {
  sidebarCollapsed: boolean;
  theme: Theme;
  activeWorkspaceId: string | null;
};

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: "system",
  activeWorkspaceId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setActiveWorkspaceId(state, action: PayloadAction<string | null>) {
      state.activeWorkspaceId = action.payload;
    },
  },
});

export const {
  setActiveWorkspaceId,
  setSidebarCollapsed,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import employeesSlice from './employees/employeesSlice';
import inventorySlice from './inventory/inventorySlice';
import machinerySlice from './machinery/machinerySlice';
import quality_controlSlice from './quality_control/quality_controlSlice';
import raw_materialsSlice from './raw_materials/raw_materialsSlice';
import suppliersSlice from './suppliers/suppliersSlice';
import work_ordersSlice from './work_orders/work_ordersSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    employees: employeesSlice,
    inventory: inventorySlice,
    machinery: machinerySlice,
    quality_control: quality_controlSlice,
    raw_materials: raw_materialsSlice,
    suppliers: suppliersSlice,
    work_orders: work_ordersSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

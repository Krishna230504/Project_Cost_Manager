
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface Item {
  id: string;
  name: string;
  cost: number;
  projectId: string;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks for items
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('projectId', '==', projectId));
      
      const querySnapshot = await getDocs(q);
      const items: Item[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name,
          cost: data.cost,
          projectId: data.projectId,
        });
      });
      
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ name, cost, projectId }: { name: string; cost: number; projectId: string }, { rejectWithValue }) => {
    try {
      const itemsRef = collection(db, 'items');
      const docRef = await addDoc(itemsRef, {
        name,
        cost,
        projectId,
        createdAt: new Date(),
      });
      
      return {
        id: docRef.id,
        name,
        cost,
        projectId,
      } as Item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, name, cost }: { id: string; name: string; cost: number }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        name,
        cost,
        updatedAt: new Date(),
      });
      
      return { id, name, cost };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await deleteDoc(itemRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.items.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const { id, name, cost } = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === id);
        
        if (itemIndex !== -1) {
          state.items[itemIndex].name = name;
          state.items[itemIndex].cost = cost;
        }
        
        state.loading = false;
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearItems, clearError } = itemsSlice.actions;
export default itemsSlice.reducer;

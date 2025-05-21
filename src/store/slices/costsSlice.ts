
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

export interface Cost {
  id: string;
  description: string;
  amount: number;
  projectId: string;
}

interface CostsState {
  costs: Cost[];
  loading: boolean;
  error: string | null;
}

const initialState: CostsState = {
  costs: [],
  loading: false,
  error: null,
};

// Async thunks for costs
export const fetchCosts = createAsyncThunk(
  'costs/fetchCosts',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'costs');
      const q = query(costsRef, where('projectId', '==', projectId));
      
      const querySnapshot = await getDocs(q);
      const costs: Cost[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        costs.push({
          id: doc.id,
          description: data.description,
          amount: data.amount,
          projectId: data.projectId,
        });
      });
      
      return costs;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCost = createAsyncThunk(
  'costs/addCost',
  async ({ description, amount, projectId }: { description: string; amount: number; projectId: string }, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'costs');
      const docRef = await addDoc(costsRef, {
        description,
        amount,
        projectId,
        createdAt: new Date(),
      });
      
      return {
        id: docRef.id,
        description,
        amount,
        projectId,
      } as Cost;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCost = createAsyncThunk(
  'costs/updateCost',
  async ({ id, description, amount }: { id: string; description: string; amount: number }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'costs', id);
      await updateDoc(costRef, {
        description,
        amount,
        updatedAt: new Date(),
      });
      
      return { id, description, amount };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCost = createAsyncThunk(
  'costs/deleteCost',
  async (id: string, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'costs', id);
      await deleteDoc(costRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    clearCosts: (state) => {
      state.costs = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch costs
      .addCase(fetchCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCosts.fulfilled, (state, action: PayloadAction<Cost[]>) => {
        state.costs = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cost
      .addCase(addCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCost.fulfilled, (state, action: PayloadAction<Cost>) => {
        state.costs.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cost
      .addCase(updateCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        const { id, description, amount } = action.payload;
        const costIndex = state.costs.findIndex((cost) => cost.id === id);
        
        if (costIndex !== -1) {
          state.costs[costIndex].description = description;
          state.costs[costIndex].amount = amount;
        }
        
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cost
      .addCase(deleteCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.costs = state.costs.filter((cost) => cost.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCosts, clearError } = costsSlice.actions;
export default costsSlice.reducer;

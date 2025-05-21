import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential, 
  User 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthState {
  user: User | null; 
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks for authentication
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }

      console.log(auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Registration error:", error);
      return rejectWithValue(error.message || "Failed to register. Please check your Firebase configuration.");
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "Failed to login. Please check your Firebase configuration.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser', 
  async (_, { rejectWithValue }) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      await signOut(auth);
      return null;
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue(error.message || "Failed to logout.");
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import type { User } from "@/data/mockData";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return data as User;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("An unknown error occurred");
    }
  },
);

interface SignInPayload {
  email: string;
  password: string;
}

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: SignInPayload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        return { session: data.session, user: profile as User };
      }

      return { session: data.session, user: null };
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }

      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role: "user" | "trainer";
}

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { email, password, fullName, role }: SignUpPayload,
    { rejectWithValue },
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role || "user",
          },
        },
      });

      if (error) throw error;

      toast.success("Check your email for confirmation!");

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }

      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const signInWithOAuth = createAsyncThunk(
  "auth/signInWithOAuth",
  async (provider: "google" | "github", { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }

      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }

      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
      }
      toast.error("An unknown error occurred");
      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (password: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success("Password updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }
      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;

      await dispatch(signOut());

      toast.success("Account deleted successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return rejectWithValue(error.message);
      }

      toast.error("An unknown error occurred");

      return rejectWithValue("An unknown error occurred");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>,
    ) {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.session;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Keep legacy login/logout for now to avoid breaking other components during migration
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.session;
        state.isLoading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log("fetchProfile", { state, action });

        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSession,
  setLoading,
  login,
  logout: logoutAction,
} = authSlice.actions;

export default authSlice.reducer;

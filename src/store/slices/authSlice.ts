import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  usersCount: number;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  usersCount: 0,
};

export const fetchUserCount = createAsyncThunk(
  "auth/fetchUserCount",
  async (_, { rejectWithValue }) => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      return count || 0;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("An unknown error occurred");
    }
  },
);

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
}

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password, fullName }: SignUpPayload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "user",
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
          scopes: provider === "github" ? "read:user" : undefined,
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

interface UpdatePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    { currentPassword, newPassword }: UpdatePasswordPayload,
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) throw new Error("User not authenticated");

      // Verify current password if provided
      if (currentPassword) {
        const { error: signInError } = await supabase.auth
          .signInWithPassword({
            email: user.email,
            password: currentPassword,
          });

        if (signInError) {
          throw new Error(
            "Verification failed: The current password you entered is incorrect.",
          );
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Profile updated successfully!");

      return data as User;
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
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserCount.fulfilled, (state, action) => {
        state.usersCount = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSession,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAppointments } from "@/store/slices/appointmentsSlice";
import { toast } from "sonner";

export const usePaymentStatus = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const toastShown = useRef(false);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    const status = searchParams.get("status");
    if (!status || toastShown.current) return;

    if (status === "success") {
      toastShown.current = true;
      toast.success("Payment successful! Your appointment is now confirmed.");

      // Clear search params
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("status");
      newParams.delete("session_id");

      setSearchParams(newParams, { replace: true });

      if (user?.id) {
        dispatch(fetchUserAppointments(user.id));
      }
    } else if (status === "cancelled") {
      toastShown.current = true;

      toast.warning("Payment was cancelled.");

      const newParams = new URLSearchParams(searchParams);

      newParams.delete("status");

      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, dispatch, user?.id]);

  // Reset the guard when the path changes or search params are cleared
  useEffect(() => {
    if (!searchParams.get("status")) {
      toastShown.current = false;
    }
  }, [searchParams]);
};

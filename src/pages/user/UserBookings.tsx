import { useState, useEffect, useMemo, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { useSearchParams } from "react-router";
import {
  fetchUserAppointments,
  updateAppointmentStatus,
} from "@/store/slices/appointmentsSlice";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const UserBookings = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const toastShown = useRef(false);

  const user = useAppSelector((s) => s.auth.user);
  const { appointments, loading } = useAppSelector((s) => s.appointments);

  // Handle payment status from URL
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

  // Filter and Sort states
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const filteredAndSortedAppointments = useMemo(() => {
    let result = [...appointments];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Filter by payment
    if (paidFilter !== "all") {
      const isPaid = paidFilter === "paid";
      result = result.filter((a) => a.paid === isPaid);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [appointments, statusFilter, paidFilter, sortOrder]);

  const handleClearFilters = () => {
    setStatusFilter("all");
    setPaidFilter("all");
    setSortOrder("newest");
  };

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await dispatch(
        updateAppointmentStatus({ id: cancelId, status: "cancelled" }),
      ).unwrap();

      toast.success("Appointment cancelled");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel appointment",
      );
    } finally {
      setCancelId(null);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your appointments
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32.5 bg-secondary">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Filter */}
          <div className="flex flex-col gap-1.5">
            <Label>Payment</Label>

            <Select value={paidFilter} onValueChange={setPaidFilter}>
              <SelectTrigger className="w-32.5 bg-secondary">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Sort */}
          <div className="flex flex-col gap-1.5">
            <Label>Sort By</Label>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-32.5 bg-secondary">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={() => handleClearFilters()}>
            <Trash />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAndSortedAppointments.map((apt, i) => {
          return (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              showTrainer
              onCancel={(id) => setCancelId(id)}
              delay={i * 0.05}
            />
          );
        })}
      </div>

      {filteredAndSortedAppointments.length === 0 && !loading && (
        <div className="glass rounded-xl p-12 text-center border border-dashed border-border/50">
          <p className="text-sm text-muted-foreground mb-2">
            No bookings found with these filters
          </p>

          <Button onClick={() => handleClearFilters()}>
            Clear all filters
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default UserBookings;

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchAdminTrainers,
  restoreTrainer,
  softDeleteTrainer,
} from "@/store/slices/trainersSlice";
import TrainerCard from "@/components/trainers/TrainerCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminTrainers = () => {
  const { trainers, loading } = useAppSelector((s) => s.trainers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [removeId, setRemoveId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminTrainers());
  }, [dispatch]);

  const trainerToRemove = trainers.find((trainer) => trainer.id === removeId);

  const handleRemove = async () => {
    if (removeId) {
      try {
        await dispatch(softDeleteTrainer(removeId)).unwrap();

        toast.success("Trainer removed (hidden from users)");

        setRemoveId(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to remove trainer",
        );
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await dispatch(restoreTrainer(id)).unwrap();

      toast.success("Trainer restored successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to restore trainer",
      );
    }
  };

  if (loading && trainers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Trainers
          </h1>

          <p className="text-sm text-muted-foreground mt-1 mb-2">
            Manage your trainer roster
          </p>

          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-base">{trainers.length}</span>{" "}
            trainer
            {trainers.length !== 1 ? "s" : ""} found
          </div>
        </div>

        <Button
          className="gradient-primary text-primary-foreground"
          onClick={() => navigate("/admin/add-trainer")}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Trainer
        </Button>
      </div>

      {trainers.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl border-dashed border-2 border-border/50">
          <p className="text-muted-foreground mb-4">No active trainers found</p>

          <Button
            className="gradient-primary text-primary-foreground"
            onClick={() => navigate("/admin/add-trainer")}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add your first trainer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((trainer, i) => {
            return (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                delay={i * 0.05}
                isAdmin={true}
                onDelete={(id) => setRemoveId(id)}
                onRestore={(id) => handleRestore(id)}
                onEdit={(id) => navigate(`/admin/edit-trainer/${id}`)}
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!removeId}
        onOpenChange={(open) => !open && setRemoveId(null)}
        title="Remove Trainer"
        description={`Are you sure you want to remove <span class="font-bold">${trainerToRemove?.full_name}</span>? This will hide them from all users.`}
        confirmLabel="Remove Trainer"
        onConfirm={handleRemove}
      />
    </div>
  );
};

export default AdminTrainers;

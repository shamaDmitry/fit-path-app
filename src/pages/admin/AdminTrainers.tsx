import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { removeTrainer } from "@/store/slices/trainersSlice";
import TrainerCard from "@/components/trainers/TrainerCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

const AdminTrainers = () => {
  const trainers = useAppSelector((s) => s.trainers.trainers);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [removeId, setRemoveId] = useState<string | null>(null);

  const trainerToRemove = trainers.find((trainer) => trainer.id === removeId);

  const handleRemove = () => {
    if (removeId) {
      dispatch(removeTrainer(removeId));

      toast.success("Trainer removed");
      setRemoveId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Trainers
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your trainer roster
          </p>
        </div>

        <Button
          className="gradient-primary text-primary-foreground"
          onClick={() => navigate("/admin/add-trainer")}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Trainer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((trainer, i) => {
          return (
            <TrainerCard key={trainer.id} trainer={trainer} delay={i * 0.05} />
          );
        })}
      </div>

      <ConfirmDialog
        open={!!removeId}
        onOpenChange={(open) => !open && setRemoveId(null)}
        title="Remove Trainer"
        description={`Are you sure you want to remove ${trainerToRemove?.full_name}? This action cannot be undone.`}
        confirmLabel="Remove Trainer"
        onConfirm={handleRemove}
      />
    </div>
  );
};

export default AdminTrainers;

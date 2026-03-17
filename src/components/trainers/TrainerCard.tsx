import { motion } from "framer-motion";
import { type Trainer } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Eye, Edit2, Trash2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInitials, cn } from "@/lib/utils";

interface TrainerCardProps {
  trainer: Trainer;
  onBook?: (trainer: Trainer) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isAdmin?: boolean;
  delay?: number;
}

const TrainerCard = ({
  trainer,
  onBook,
  onEdit,
  onDelete,
  onRestore,
  isAdmin = false,
  delay = 0,
}: TrainerCardProps) => {
  const navigate = useNavigate();
  const initials = getUserInitials(trainer.full_name);
  const color = trainer.color || "158 64% 32%";
  const isInactive = trainer.is_active === false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "glass glass-hover rounded-xl p-5 flex flex-col relative overflow-hidden",
        isInactive && "opacity-70 grayscale-[0.5]",
      )}
    >
      {isInactive && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-2 text-xs h-5"
        >
          Inactive
        </Badge>
      )}

      {/* Color accent top */}
      <div
        className="h-1 -mx-5 -mt-5 rounded-t-xl mb-4"
        style={{ backgroundColor: `hsl(${color})` }}
      />

      <div className="flex items-start gap-4 mb-4">
        <Avatar
          className="h-14 w-14 shrink-0 cursor-pointer"
          onClick={() => navigate(`/trainers/${trainer.id}`)}
        >
          <AvatarFallback
            className="font-display font-bold text-lg"
            style={{
              backgroundColor: `hsl(${color} / 0.12)`,
              color: `hsl(${color})`,
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3
            className="font-display text-lg font-semibold text-foreground truncate cursor-pointer hover:underline"
            onClick={() => navigate(`/trainers/${trainer.id}`)}
          >
            {trainer.full_name}
          </h3>

          <Badge
            variant="secondary"
            className="mt-1 text-xs font-medium"
            style={{
              backgroundColor: `hsl(${color} / 0.2)`,
              color: `hsl(${color})`,
            }}
          >
            {trainer.specialty?.label || "Specialist"}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
        {trainer.bio}
      </p>

      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />

          <span className="font-medium text-foreground">{trainer.rating}</span>
        </span>

        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {trainer.experience_years} years exp.
        </span>
      </div>

      <div className="flex gap-4">
        {isAdmin ? (
          <>
            <Button className="flex-1" onClick={() => onEdit?.(trainer.id)}>
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>

            {isInactive ? (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onRestore?.(trainer.id)}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Restore
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete?.(trainer.id)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/trainers/${trainer.id}`)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Profile
            </Button>

            {onBook && (
              <Button
                onClick={() => onBook(trainer)}
                className="flex-1 gradient-primary text-primary-foreground"
              >
                Book Session
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TrainerCard;

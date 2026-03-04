import { motion } from "framer-motion";
import { trainerColors, type Trainer } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInitials } from "@/lib/utils";

interface TrainerCardProps {
  trainer: Trainer;
  onBook?: (trainer: Trainer) => void;
  delay?: number;
}

const TrainerCard = ({ trainer, onBook, delay = 0 }: TrainerCardProps) => {
  const navigate = useNavigate();

  const initials = getUserInitials(trainer.full_name);

  const color = trainerColors[trainer.id] || "158 64% 32%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass glass-hover rounded-xl p-5 flex flex-col"
    >
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
            className="font-display font-semibold text-foreground truncate cursor-pointer hover:underline"
            onClick={() => navigate(`/trainers/${trainer.id}`)}
          >
            {trainer.full_name}
          </h3>

          <Badge
            variant="secondary"
            className="mt-1 text-[10px] font-medium"
            style={{
              backgroundColor: `hsl(${color} / 0.1)`,
              color: `hsl(${color})`,
            }}
          >
            {trainer.specialty}
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

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => navigate(`/trainers/${trainer.id}`)}
        >
          <Eye className="w-3 h-3 mr-1" />
          Profile
        </Button>

        {onBook && (
          <Button
            size="sm"
            onClick={() => onBook(trainer)}
            className="flex-1 gradient-primary text-primary-foreground text-xs"
          >
            Book Session
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TrainerCard;

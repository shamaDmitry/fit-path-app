import { motion } from "framer-motion";
import { type Appointment } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, X, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router";

interface AppointmentCardProps {
  appointment: Appointment;
  showTrainer?: boolean;
  showUser?: boolean;
  onCancel?: (id: string) => void;
  delay?: number;
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-info/10 text-info border-info/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const AppointmentCard = ({
  appointment,
  showTrainer = true,
  showUser = false,
  onCancel,
  delay = 0,
}: AppointmentCardProps) => {
  console.log("appointment", appointment);

  const navigate = useNavigate();
  const start = new Date(appointment.start_time);
  const end = new Date(appointment.end_time);
  const trainerColor = appointment.trainer?.color || "158 64% 32%";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/appointments/${appointment.id}`)}
    >
      {/* Trainer color bar */}
      <div
        className="w-1 h-12 rounded-full shrink-0"
        style={{ backgroundColor: `hsl(${trainerColor})` }}
      />

      {/* Date block */}
      <div
        className="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
        style={{
          backgroundColor: `hsl(${trainerColor} / 0.1)`,
        }}
      >
        <span
          className="text-sm uppercase font-medium"
          style={{ color: `hsl(${trainerColor})` }}
        >
          {format(start, "MMM")}
        </span>

        <span
          className="text-lg font-display font-bold leading-tight"
          style={{ color: `hsl(${trainerColor})` }}
        >
          {format(start, "dd")}
        </span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {showTrainer && (
            <p className="text-base font-medium text-foreground truncate">
              {appointment.trainer_name}
            </p>
          )}

          {showUser && (
            <div className="text-base font-semibold text-foreground truncate flex items-center gap-1">
              <div className="bg-primary p-1 rounded-full text-primary-foreground">
                <User className="w-3 h-3" />
              </div>

              {appointment.user_name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(start, "HH:mm")} – {format(end, "HH:mm")}
          </span>

          <Badge
            variant="outline"
            className={`text-sm capitalize border ${statusStyles[appointment.status]}`}
          >
            {appointment.status}
          </Badge>

          {appointment.price && (
            <span className="flex text-base text-foreground font-medium items-center gap-0.5">
              <DollarSign className="w-3 h-3" />
              {appointment.price}

              {appointment.paid ? (
                <Badge
                  variant="outline"
                  className="text-sm ml-1 bg-success/10 text-success border-success/20"
                >
                  Paid
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-sm ml-1 bg-warning/10 text-warning border-warning/20"
                >
                  Unpaid
                </Badge>
              )}
            </span>
          )}
        </div>
      </div>
      {/* Actions */}
      <div
        className="flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {onCancel && appointment.status === "scheduled" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onCancel(appointment.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;

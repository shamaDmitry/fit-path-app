import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface StatCardProps {
  loading?: boolean;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

const StatCard = ({
  loading,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>

        {trend && (
          <span
            className={cn("text-xs font-medium px-2 py-0.5 rounded-full", {
              "bg-success/10 text-success": trend.positive,
              "bg-destructive/10 text-destructive": !trend.positive,
            })}
          >
            {trend.value || 0}
          </span>
        )}
      </div>

      {loading ? (
        <Skeleton className="size-8 bg-secondary" />
      ) : (
        <p className="text-2xl font-display font-bold text-foreground">
          {value}
        </p>
      )}

      {loading ? (
        <>
          <Skeleton className="size-4 w-1/2 my-1 bg-secondary" />
          <Skeleton className="size-4 w-3/4 my-1 bg-secondary" />
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {title}
          </p>

          {subtitle && (
            <p className="text-sm text-muted-foreground/70 mt-0.5">
              {subtitle}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatCard;

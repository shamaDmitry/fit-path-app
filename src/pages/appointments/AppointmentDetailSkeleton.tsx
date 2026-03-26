import { Skeleton } from "@/components/ui/skeleton";

const AppointmentDetailSkeleton = () => {
  return (
    <div className="mx-auto text-center">
      <p className="text-primary mb-4 animate-pulse">Loading appointment...</p>

      <Skeleton className="bg-secondary p-4">
        <Skeleton className="bg-foreground/10 flex items-center p-4 mb-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="w-24 h-4 rounded-sm ml-4" />
        </Skeleton>

        <div className="grid grid-cols-2 gap-4">
          {new Array(4).fill(0).map((_, i) => {
            return (
              <Skeleton key={i} className="space-y-1 bg-foreground/10 p-4">
                <Skeleton className="w-16 h-3 rounded-sm" />
                <Skeleton className="w-full h-4 rounded-sm" />
              </Skeleton>
            );
          })}
        </div>
      </Skeleton>
    </div>
  );
};

export default AppointmentDetailSkeleton;

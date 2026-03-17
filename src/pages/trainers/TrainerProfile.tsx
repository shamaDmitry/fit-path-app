import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  Clock,
  Mail,
  Phone,
  Award,
  Calendar,
} from "lucide-react";

import BookingDialog from "@/components/booking/BookingDialog";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getUserInitials } from "@/lib/utils";
import { fetchTrainer } from "@/store/slices/trainersSlice";
import { Skeleton } from "@/components/ui/skeleton";

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const {
    currentTrainer: trainer,
    loading,
    error,
  } = useAppSelector((s) => s.trainers);

  // const trainers = useAppSelector((store) => store.trainers.trainers);
  const timeslots = useAppSelector((store) => store.timeslots.timeslots);

  const appointments = useAppSelector(
    (store) => store.appointments.appointments,
  );

  const user = useAppSelector((store) => store.auth.user);

  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainer(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">{error}</p>

        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const color = trainer.color || "158 64% 32%";

  const initials = getUserInitials(trainer.full_name);

  const availableSlots = timeslots.filter(
    (ts) => ts.trainer_id === trainer.id && !ts.is_booked,
  );

  const completedSessions = appointments.filter(
    (a) => a.trainer_id === trainer.id && a.status === "completed",
  ).length;

  // const totalSessions = appointments.filter(
  //   (a) => a.trainer_id === trainer.id,
  // ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hero */}
        <Card className="glass border-border/50 overflow-hidden">
          <div className="h-2" style={{ backgroundColor: `hsl(${color})` }} />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 shrink-0">
                <AvatarFallback
                  className="font-display font-bold text-3xl"
                  style={{
                    backgroundColor: `hsl(${color} / 0.12)`,
                    color: `hsl(${color})`,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {trainer.full_name}
                </h1>

                <Badge
                  className="mt-2"
                  style={{
                    backgroundColor: `hsl(${color} / 0.1)`,
                    color: `hsl(${color})`,
                  }}
                >
                  {trainer.specialty?.label || "Specialist"}
                </Badge>

                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {trainer.bio}
                </p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-medium text-foreground">
                      {trainer.rating}
                    </span>{" "}
                    rating
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {trainer.experience_years}{" "}
                    years
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {completedSessions}{" "}
                    sessions completed
                  </span>
                </div>

                {user?.role === "user" && (
                  <Button
                    className="mt-5 gradient-primary text-primary-foreground"
                    onClick={() => setBookingOpen(true)}
                  >
                    Book a Session
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-base">Contact</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {trainer.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{trainer.email}</span>
                </div>
              )}

              {trainer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{trainer.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-base">
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(trainer.certifications || []).map((cert) => (
                  <Badge
                    key={cert}
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" /> {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available slots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-base">
                Available Timeslots ({availableSlots.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No slots available
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/30 text-sm"
                    >
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{format(parseISO(slot.date), "EEE, MMM d")}</span>

                      <span className="text-muted-foreground">
                        {slot.start_time} – {slot.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BookingDialog
        trainer={trainer}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
};

export default TrainerProfile;

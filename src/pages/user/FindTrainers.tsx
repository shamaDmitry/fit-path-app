import { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchTrainers, fetchSpecialties } from "@/store/slices/trainersSlice";
import BookingDialog from "@/components/booking/BookingDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import type { Trainer } from "@/types";
import TrainerCard from "@/components/trainers/TrainerCard";

const sortOptions = [
  { value: "rating", label: "Top Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "name", label: "Name A-Z" },
];

const FindTrainers = () => {
  const { trainers, specialties, loading } = useAppSelector(
    (store) => store.trainers,
  );
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [specialtyId, setSpecialtyId] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = [...trainers];

    if (search) {
      const q = search.toLowerCase();

      result = result.filter(
        (t) =>
          t.full_name.toLowerCase().includes(q) ||
          t.specialty?.label.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q),
      );
    }

    if (specialtyId !== "all") {
      result = result.filter((trainer) => trainer.specialty_id === specialtyId);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      result.sort((a, b) => b.experience_years - a.experience_years);
    } else {
      result.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    return result;
  }, [trainers, search, specialtyId, sortBy]);

  const handleBook = (trainer: Trainer) => {
    setSelectedTrainer(trainer);

    setBookingOpen(true);
  };

  if (loading && trainers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Find Your Trainer
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Browse and book sessions with our expert trainers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-foreground" />

          <Input
            placeholder="Search trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary"
          />
        </div>

        <Select value={specialtyId} onValueChange={setSpecialtyId}>
          <SelectTrigger
            title={
              specialties.find((s) => s.id === specialtyId)?.label ||
              "All Specialties"
            }
            className="w-full sm:w-48 bg-secondary items-start justify-start **:data-[slot=select-value]:text-ellipsis **:data-[slot=select-value]:block"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-secondary-foreground" />

            <SelectValue className="flex-1" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>

            {specialties.map((item) => {
              return (
                <SelectItem key={item.id} value={item.id} className="">
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-44 bg-secondary">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {sortOptions.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        <span className="font-bold text-base text-foreground">
          {filtered.length}
        </span>{" "}
        trainer
        {filtered.length !== 1 ? "s" : ""} found
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((trainer, i) => {
          return (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onBook={handleBook}
              delay={i * 0.05}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Search className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />

          <p className="text-sm text-muted-foreground">
            No trainers match your search
          </p>
        </div>
      )}

      <BookingDialog
        trainer={selectedTrainer}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
};

export default FindTrainers;

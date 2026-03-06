import { useState, useMemo } from "react";
import { useAppSelector } from "@/store";

import BookingDialog from "@/components/booking/BookingDialog";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, SlidersHorizontal } from "lucide-react";
import type { Trainer } from "@/data/mockData";
import TrainerCard from "@/components/trainers/TrainerCard";

const specialties = [
  "All",
  "Strength Training",
  "Yoga & Pilates",
  "HIIT & Athletics",
  "Nutrition & Fitness",
  "CrossFit",
  "Dance & Cardio",
];

const sortOptions = [
  { value: "rating", label: "Top Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "name", label: "Name A-Z" },
];

const FindTrainers = () => {
  const trainers = useAppSelector((store) => store.trainers.trainers);

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...trainers];

    if (search) {
      const q = search.toLowerCase();

      result = result.filter(
        (t) =>
          t.full_name.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q),
      );
    }

    if (specialty !== "All") {
      result = result.filter((trainer) => trainer.specialty === specialty);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      result.sort((a, b) => b.experience_years - a.experience_years);
    } else {
      result.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    return result;
  }, [trainers, search, specialty, sortBy]);

  const handleBook = (trainer: Trainer) => {
    setSelectedTrainer(trainer);

    setBookingOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-muted/50 border-border/50"
          />
        </div>

        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-48 h-10 bg-muted/50 border-border/50 items-start justify-start">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-muted-foreground" />

            <SelectValue className="flex-1" />
          </SelectTrigger>

          <SelectContent>
            {specialties.map((specialty) => {
              return (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-44 h-10 bg-muted/50 border-border/50">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {sortOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} trainer{filtered.length !== 1 ? "s" : ""} found
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

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateTrainer, fetchTrainers } from "@/store/slices/trainersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Check, Plus, X, Loader2 } from "lucide-react";
import { trainerColors } from "@/data/mockData";
import { cn } from "@/lib/utils";

const specialties = [
  "Strength Training",
  "Yoga & Pilates",
  "HIIT & Athletics",
  "Nutrition & Fitness",
  "CrossFit",
  "Dance & Cardio",
];

const colorOptions = Object.entries(trainerColors).map(([key, value]) => ({
  key,
  value,
}));

const EditTrainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { trainers, loading: storeLoading } = useAppSelector((s) => s.trainers);
  const trainer = trainers.find((t) => t.id === id);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    if (trainers.length === 0) {
      dispatch(fetchTrainers());
    }
  }, [dispatch, trainers.length]);

  useEffect(() => {
    if (trainer) {
      setName(trainer.full_name || "");
      setBio(trainer.bio || "");
      setSpecialty(trainer.specialty || "");
      setExperience(trainer.experience_years?.toString() || "0");
      setPhone(trainer.phone || "");
      setEmail(trainer.email || "");
      setSelectedColor(trainer.color || colorOptions[0].value);
      setCertifications(trainer.certifications || []);
    }
  }, [trainer]);

  const addCertification = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);
      setCertInput("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (!name || !specialty) {
      toast.error("Name and specialty are required");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        updateTrainer({
          id,
          full_name: name,
          bio,
          specialty,
          experience_years: parseInt(experience) || 0,
          color: selectedColor,
          certifications,
          phone: phone || undefined,
          email: email || undefined,
        })
      ).unwrap();

      toast.success(`${name} updated successfully`);
      navigate("/admin/trainers");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update trainer"
      );
    } finally {
      setLoading(false);
    }
  };

  if (storeLoading && trainers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trainer && !storeLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Trainer not found</p>
        <Button onClick={() => navigate("/admin/trainers")}>Back to Trainers</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Button
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="font-display">Edit Trainer: {trainer?.full_name}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Full Name *
              </Label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-10 bg-muted/50 border-border/50"
                disabled={loading}
              />
            </div>

            {/* Email (Read Only usually, or editable) */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                className="h-10 bg-muted/20 border-border/30 text-muted-foreground cursor-not-allowed"
                disabled={true}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Email cannot be changed here as it is linked to the auth account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Specialty */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Specialty *
                </Label>

                <Select value={specialty} onValueChange={setSpecialty} disabled={loading}>
                  <SelectTrigger className="h-10 bg-muted/50 border-border/50 w-full">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>

                  <SelectContent>
                    {specialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Years of Experience
                </Label>

                <Input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="5"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Phone</Label>

              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0100"
                className="h-10 bg-muted/50 border-border/50"
                disabled={loading}
              />
            </div>

            {/* Color Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Trainer Color
              </Label>

              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => {
                  return (
                    <Button
                      size={"icon"}
                      key={color.key}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      disabled={loading}
                      className={cn(
                        "w-8 h-8 rounded-full border-3 transition-all duration-200",
                      )}
                      style={{
                        backgroundColor: `hsl(${color.value})`,
                        borderColor: `hsl(${color.value})`,
                        boxShadow:
                          selectedColor === color.value
                            ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(${color.value})`
                            : "none",
                      }}
                    >
                      {selectedColor === color.value && (
                        <Check className="size-5 font-bold" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Certifications
              </Label>

              <div className="flex gap-2">
                <Input
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="e.g. NASM-CPT"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={addCertification}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {certifications.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {certifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant="secondary"
                      className="gap-1 pr-1 text-sm"
                    >
                      {cert}
                      <Button
                        variant={"destructive"}
                        size={"icon-xs"}
                        onClick={() => removeCertification(cert)}
                        className="ml-0.5 transition-colors rounded-2xl"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bio</Label>

              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief description..."
                className="bg-muted/50 border-border/50 min-h-25"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTrainer;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSpecialties } from "@/store/slices/trainersSlice";
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
import { supabase } from "@/lib/supabase";
import PasswordInput from "@/components/shared/PasswordInput";

const colorOptions = Object.entries(trainerColors).map(([key, value]) => ({
  key,
  value,
}));

const AddTrainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { specialties } = useAppSelector((s) => s.trainers);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Test Trainer");
  const [bio, setBio] = useState("Test Trainer bio");
  const [specialtyId, setSpecialtyId] = useState("");
  const [experience, setExperience] = useState("5");
  const [phone, setPhone] = useState("+380994567896");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test1234");
  const [selectedColor, setSelectedColor] = useState(colorOptions[4].value);
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  useEffect(() => {
    if (!specialties.length) return;

    const hasSelectedSpecialty = specialties.some(
      (specialty) => specialty.id === specialtyId,
    );

    if (!hasSelectedSpecialty) {
      setSpecialtyId(specialties[0].id);
    }
  }, [specialtyId, specialties]);

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

    if (!name || !specialtyId || !email || !password || !experience || !bio) {
      toast.error(
        "Name, specialty, email, password, experience, and bio are required",
      );
      return;
    }

    setLoading(true);
    try {
      // Call the Edge Function
      const { error } = await supabase.functions.invoke("create-trainer", {
        body: {
          email,
          password,
          full_name: name,
          bio,
          specialty_id: specialtyId,
          experience_years: experience,
          phone,
          color: selectedColor,
          certifications,
        },
      });

      if (error) throw error;

      toast.success(`${name} added as trainer successfully.`);
      navigate("/admin/trainers");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add trainer",
      );
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle className="font-display">Add New Trainer</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-10 bg-muted/50 border-border/50"
                disabled={loading}
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainer@fitpath.com"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Password <span className="text-destructive">*</span>
                </Label>

                <PasswordInput
                  value={password}
                  setPassword={(password) => setPassword(password)}
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Specialty */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Specialty <span className="text-destructive">*</span>
                </Label>

                <Select
                  value={specialtyId}
                  onValueChange={setSpecialtyId}
                  disabled={loading || specialties.length === 0}
                >
                  <SelectTrigger className="h-10 bg-muted/50 border-border/50 w-full">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>

                  <SelectContent>
                    {specialties.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label} - {item.value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Years of Experience
                  <span className="text-destructive">*</span>
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
              <Label className="text-xs text-muted-foreground">
                Bio
                <span className="text-destructive">*</span>
              </Label>

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
                  Creating Trainer...
                </>
              ) : (
                "Add Trainer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTrainer;

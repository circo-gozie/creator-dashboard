"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CardContent,
  CardDescription,
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Circle, LockIcon, Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import CategoryButton from "@/components/buttons/category-button";
import { Toggle } from "../ui/toggle";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useState } from "react";

const stepDefinitions = [
  {
    title: "Studio type",
    description: "Decide how people will access your content.",
  },
  {
    title: "Studio Name & Description",
    description: "This is how people will find and remember you.",
  },
  {
    title: "Studio Category",
    description:
      "Choose the category that best matches your content for easier discovery.",
  },
];

// Zod Schema
const setupFormSchema = z.object({
  type: z.enum(["public", "private"], {
    message: "Please select a studio type",
  }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must be 20 characters or less" })
    .regex(/^[a-zA-Z0-9 _.]+$/, {
      message:
        "Name can only contain letters, numbers, spaces, underscores, or dots",
    }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
});

type SetupFormValues = z.infer<typeof setupFormSchema>;

interface SetupFormProps {
  setIsSetupCompleted: (isSetupCompleted: boolean) => void;
}

export default function SetupForm({ setIsSetupCompleted }: SetupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      type: undefined,
      name: "",
      description: "",
      category: "",
    },
  });

  const onSubmit = (data: SetupFormValues) => {
    console.log("Form submitted:", data);
    // Handle form submission here
    setIsSetupCompleted(true);
  };

  const selectedCategory = form.watch("category") || "";

  const toggleCategory = (category: string) => {
    const currentCategory = form.getValues("category");
    if (currentCategory === category) {
      form.setValue("category", "");
    } else {
      form.setValue("category", category);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger("type");
    } else if (currentStep === 2) {
      isValid = await form.trigger(["name", "description"]);
    }

    if (isValid) {
      setCurrentStep(Math.min(currentStep + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, numbers, spaces, underscores, and dots
    const value = e.target.value.replace(/[^a-zA-Z0-9 _.]/g, "");
    form.setValue("name", value, { shouldValidate: true });
  };

  return (
    <div className="flex size-full h-full flex-col items-center justify-center bg-background-300 py-8">
      <Card className="bg-background !w-full flex flex-row gap-0 p-0 max-w-6xl md:aspect-video relative overflow-hidden">
        <div className="basis-2/5 bg-background">
          <CardHeader className="flex-col border-b-0 p-4 sm:p-8">
            <CardTitle>
              <p className="text-4xl font-bold">Setup your studio</p>
            </CardTitle>
            <CardDescription>
              Build your space, share your vision, and start earning from your
              community.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full space-y-1 p-4 sm:px-8">
            <Toggle
              className={`px-0 space-x-1 h-0 !py-0 ${
                currentStep === 1 ? "bg-orange-400" : "bg-transparent"
              }`}
            >
              <Circle className="size-3" /> <p>Studio Type</p>
            </Toggle>
            <Separator
              className={`h-4 translate-x-1 mt-1 ${
                currentStep >= 2 ? "bg-foreground" : "bg-foreground/30"
              }`}
              orientation="vertical"
            />
            <Toggle
              className={`px-0 space-x-1 h-0 !py-0 ${
                currentStep === 2 ? "bg-orange-400" : "bg-transparent"
              }`}
            >
              <Circle className="size-3" /> <p>Studio Details</p>
            </Toggle>
            <Separator
              className={`h-4 translate-x-1 my-1 ${
                currentStep >= 3 ? "bg-foreground" : "bg-foreground/30"
              }`}
              orientation="vertical"
            />
            <Toggle
              className={`px-0 space-x-1 h-0 !py-0 ${
                currentStep === 3 ? "bg-orange-400" : "bg-transparent"
              }`}
            >
              <Circle className="size-3" /> <p>Category</p>
            </Toggle>
          </CardContent>
        </div>

        <div className="grow bg-secondary overflow-y-auto relative hide-scrollbar">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full overflow-hidden"
          >
            <CardHeader className="flex-col items-start p-4">
              <CardTitle>
                <p className="text-2xl font-bold">
                  {stepDefinitions[currentStep - 1].title}
                </p>
              </CardTitle>
              <CardDescription>
                {stepDefinitions[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full grow h-full overflow-y-scroll hide-scrollbar space-y-6 p-4 sm:px-8 sm:pb-62 ">
              {/* Step 1: Studio Type */}
              {currentStep === 1 && (
                <FieldGroup>
                  <Field>
                    <ToggleGroup
                      type="single"
                      value={form.watch("type") || ""}
                      onValueChange={(value) => {
                        if (value)
                          form.setValue("type", value as "public" | "private", {
                            shouldValidate: true,
                          });
                      }}
                      variant="outline"
                      orientation="vertical"
                      className="w-full flex-col items-start gap-3 mt-3"
                    >
                      <ToggleGroupItem
                        value="private"
                        aria-label="Toggle private"
                        data-state={
                          form.watch("type") === "private" ? "on" : "off"
                        }
                        className="data-[state=on]:border-foreground data-[state=on]:bg-secondary-200 w-full  !border border-border justify-start h-fit p-4 gap-4 !rounded-xl  hover:text-foreground"
                      >
                        <div
                          data-state={
                            form.watch("type") === "private" ? "on" : "off"
                          }
                          className="size-16 data-[state=on]:border-primary outline-1 outline-border data-[state=on]:outline-primary outline-offset-2 p-1.5 rounded-full border border-border items-center bg-primary-foreground-300/10 data-[state=on]:bg-primary/20 justify-center flex"
                        >
                          <div
                            data-state={
                              form.watch("type") === "private" ? "on" : "off"
                            }
                            className="size-full bg-secondary data-[state=on]:bg-gradient-to-r from-[#ae0c4d] via-[#cd1942] to-[#ff2f2f] grid place-items-center border border-foreground/20 data-[state=on]:border-0 rounded-full "
                          >
                            <LockIcon className="size-4" />
                          </div>
                        </div>
                        <div className="text-start">
                          <p className="text-lg font-semibold">
                            Private Studio
                          </p>
                          <p className="text-sm font-medium text-muted-foreground">
                            Build a loyal community with subscriber-only access.
                          </p>
                        </div>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="public"
                        aria-label="Toggle public"
                        data-state={
                          form.watch("type") === "public" ? "on" : "off"
                        }
                        className="data-[state=on]:border-foreground data-[state=on]:bg-secondary-200 w-full  !border border-border justify-start h-fit p-4 gap-4 !rounded-xl  hover:text-foreground"
                      >
                        <div
                          data-state={
                            form.watch("type") === "public" ? "on" : "off"
                          }
                          className="size-16 data-[state=on]:border-primary outline-1 outline-border data-[state=on]:outline-primary outline-offset-2 p-1.5 rounded-full border border-border items-center bg-primary-foreground-300/10 data-[state=on]:bg-primary/20 justify-center flex"
                        >
                          <div
                            data-state={
                              form.watch("type") === "public" ? "on" : "off"
                            }
                            className="size-full bg-secondary data-[state=on]:bg-gradient-to-r from-[#ae0c4d] via-[#cd1942] to-[#ff2f2f] grid place-items-center border border-foreground/20 data-[state=on]:border-0 rounded-full "
                          >
                            <Megaphone className="size-4" />
                          </div>
                        </div>
                        <div className="text-start">
                          <p className="text-lg font-semibold">Public Studio</p>
                          <p className="text-sm font-medium text-muted-foreground">
                            Reach a wider audience with pay-per-view and sales
                          </p>
                        </div>
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Label>
                      <Link href="/" className="text-sm mt-4 text-red-300/70">
                        {" "}
                        {"Can't"} decide? See the difference{" "}
                      </Link>
                    </Label>
                    <FieldError
                      errors={
                        form.formState.errors.type
                          ? [form.formState.errors.type]
                          : []
                      }
                    />
                  </Field>
                </FieldGroup>
              )}

              {/* Step 2: Studio Name & Description */}
              {currentStep === 2 && (
                <>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Studio Name</FieldLabel>

                      <Input
                        id="name"
                        placeholder="Enter studio name"
                        maxLength={20}
                        value={form.watch("name")}
                        onChange={handleNameInput}
                        aria-invalid={!!form.formState.errors.name}
                      />
                      {!form.formState.errors.name ? (
                        <FieldDescription>
                          Your Studio name must be 20 characters or less and
                          contain only letters, numbers, spacing, underscore or
                          dot
                        </FieldDescription>
                      ) : (
                        <FieldError
                          errors={
                            form.formState.errors.name
                              ? [form.formState.errors.name]
                              : []
                          }
                        />
                      )}
                    </Field>
                  </FieldGroup>

                  {/* Studio Description */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe your studio"
                        {...form.register("description")}
                        aria-invalid={!!form.formState.errors.description}
                        className="aspect-6/1"
                        rows={4}
                      />
                      <FieldError
                        errors={
                          form.formState.errors.description
                            ? [form.formState.errors.description]
                            : []
                        }
                      />
                    </Field>
                  </FieldGroup>
                </>
              )}

              {/* Step 3: Categories */}
              {currentStep === 3 && (
                <FieldGroup>
                  <Field>
                    {form.formState.errors.category ? (
                      <FieldError
                        errors={
                          form.formState.errors.category
                            ? [form.formState.errors.category]
                            : []
                        }
                      />
                    ) : (
                      <FieldLabel>Category</FieldLabel>
                    )}
                    <FieldDescription>
                      Select one category that best describes your content.
                    </FieldDescription>
                    <div className="mt-3 flex flex-wrap gap-1 sm:grid grid-cols-4">
                      {CATEGORY_OPTIONS.map((category) => (
                        <CategoryButton
                          key={category}
                          category={category}
                          selectedCategories={[selectedCategory]}
                          toggleCategory={toggleCategory}
                        />
                      ))}
                    </div>
                  </Field>
                </FieldGroup>
              )}
            </CardContent>

            {/* Navigation Footer */}
            <CardFooter className="bg-secondary border-t border-border p-4 sm:p-8 justify-end flex gap-3 absolute bottom-0 left-0 right-0">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-8"
                >
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="default"
                  className="px-8"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-8"
                >
                  Create Studio
                </Button>
              )}
            </CardFooter>
          </form>
        </div>

        <div className="size-52 absolute left-0 -bottom-4">
          <div className="size-full relative">
            <Image
              src="/circo-gray.svg"
              alt="setup"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

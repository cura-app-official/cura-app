import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
    birthDateGenderSchema,
    type BirthDateGenderForm,
} from "@/lib/validations";
import { useSignup } from "@/store/signup-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;

export default function SignupBirthdateScreen() {
  const { setData } = useSignup();
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BirthDateGenderForm>({
    resolver: zodResolver(birthDateGenderSchema),
    defaultValues: { birth_date: "", gender: undefined },
  });

  const selectedGender = watch("gender");

  const dayRef = useRef("");
  const monthValRef = useRef("");
  const yearValRef = useRef("");

  const buildDate = () => {
    const d = dayRef.current.padStart(2, "0");
    const m = monthValRef.current.padStart(2, "0");
    const y = yearValRef.current;
    if (y.length === 4 && m.length >= 1 && d.length >= 1) {
      setValue("birth_date", `${y}-${m}-${d}`, { shouldValidate: true });
    }
  };

  const onSubmit = (values: BirthDateGenderForm) => {
    setData({ birth_date: values.birth_date, gender: values.gender });
    router.push("/(auth)/signup-email");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="px-6 pt-2">
          <BackButton />
        </View>
        <View className="flex-1 px-6 pt-8">
          <Text className="text-4xl font-neuton-bold text-foreground">
            About you
          </Text>
          <Text className="text-xl font-neuton text-muted-foreground mt-3 mb-10">
            Tell us a bit about yourself
          </Text>

          {/* DOB Fields */}
          <View className="mb-8">
            <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
              Date of birth
            </Text>
            <Controller
              control={control}
              name="birth_date"
              render={() => (
                <View className="flex-row gap-3">
                  <FloatingLabelInput
                    label="DD"
                    value={day}
                    containerClassName="flex-1"
                    className="text-center"
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={(v) => {
                      setDay(v);
                      dayRef.current = v;
                      buildDate();
                      if (v.length === 2) monthRef.current?.focus();
                    }}
                  />
                  <FloatingLabelInput
                    ref={monthRef}
                    label="MM"
                    value={month}
                    containerClassName="flex-1"
                    className="text-center"
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={(v) => {
                      setMonth(v);
                      monthValRef.current = v;
                      buildDate();
                      if (v.length === 2) yearRef.current?.focus();
                    }}
                  />
                  <FloatingLabelInput
                    ref={yearRef}
                    label="YYYY"
                    value={year}
                    containerClassName="flex-[1.4]"
                    className="text-center"
                    keyboardType="number-pad"
                    maxLength={4}
                    onChangeText={(v) => {
                      setYear(v);
                      yearValRef.current = v;
                      buildDate();
                    }}
                  />
                </View>
              )}
            />
            {errors.birth_date && (
              <Text className="text-base font-neuton text-error ml-2 mt-2">
                {errors.birth_date.message}
              </Text>
            )}
          </View>

          {/* Gender chips */}
          <View>
            <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
              Gender
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {GENDERS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() =>
                    setValue("gender", g, { shouldValidate: true })
                  }
                  className={`px-6 py-3.5 rounded-3xl ${
                    selectedGender === g ? "bg-accent" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-lg font-neuton ${
                      selectedGender === g ? "text-white" : "text-foreground"
                    }`}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.gender && (
              <Text className="text-base font-neuton text-error ml-2 mt-2">
                {errors.gender.message}
              </Text>
            )}
          </View>
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

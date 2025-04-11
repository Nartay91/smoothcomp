import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../api/api";
import { UserLogin, GenderEnum } from "../../api/type";
import { useAuthStore } from "../../store/authStore";

// Схемы валидации с помощью Zod
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(1, "Full name is required"),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be in YYYY-MM-DD format"),
  city: z.string().min(1, "City is required"),
  gender: z.nativeEnum(GenderEnum, { required_error: "Gender is required" }),
  phone_number: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Phone number must be in format +7 (XXX) XXX-XX-XX"),
});

// Типы форм
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Тип для возвращаемого значения хука
export interface AuthFormLogic {
  isLogin: boolean;
  flipping: boolean;
  apiError: string | null;
  loginErrors: FieldErrors<LoginFormData> | null;
  signupErrors: FieldErrors<SignupFormData> | null;
  register: ReturnType<typeof useForm<LoginFormData | SignupFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<LoginFormData | SignupFormData>>["handleSubmit"];
  setValue: ReturnType<typeof useForm<LoginFormData | SignupFormData>>["setValue"];
  isSubmitting: boolean;
  handleSwitch: (login: boolean) => void;
  onSubmit: SubmitHandler<LoginFormData | SignupFormData>;
}

export const useAuthFormLogic = (): AuthFormLogic => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [flipping, setFlipping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginFormData | SignupFormData> | null>(null);
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: isLogin
      ? { username: "", password: "" }
      : {
          username: "",
          email: "",
          password: "",
          full_name: "",
          birth_date: "",
          city: "",
          gender: undefined,
          phone_number: "",
        },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const timer = setTimeout(() => {
        setFieldErrors(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  const handleSwitch = (login: boolean) => {
    if (isLogin !== login) {
      setFlipping(true);
      setApiError(null);
      setFieldErrors(null);
      setTimeout(() => {
        setIsLogin(login);
      }, 300);
      setTimeout(() => {
        setFlipping(false);
      }, 600);
    }
  };

  const onSubmit: SubmitHandler<LoginFormData | SignupFormData> = async (data) => {
    try {
      setApiError(null);
      setFieldErrors(null);
      if (isLogin) {
        const loginData = data as UserLogin;
        const response = await apiClient.login(loginData);
        setToken(response.data.access_token);
      } else {
        const signupData = data as SignupFormData;
        await apiClient.register({
          ...signupData,
          user_type_id: 0,
        });
        const loginResponse = await apiClient.login({
          username: signupData.username,
          password: signupData.password,
        });
        setToken(loginResponse.data.access_token);
      }
    } catch (err: any) {
      setApiError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return {
    isLogin,
    flipping,
    apiError,
    loginErrors: isLogin ? (fieldErrors as FieldErrors<LoginFormData>) : null,
    signupErrors: !isLogin ? (fieldErrors as FieldErrors<SignupFormData>) : null,
    register,
    handleSubmit,
    setValue,
    isSubmitting,
    handleSwitch,
    onSubmit,
  };
};
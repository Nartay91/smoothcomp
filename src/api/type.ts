export enum GenderEnum {
  Male = "Мужской",
  Female = "Женский",
}
  
  export interface HTTPValidationError {
    detail?: ValidationError[];
  }
  
  export enum PaymentStatus {
    Pending = "pending",
    Completed = "completed",
    Refunded = "refunded",
  }
  
  export interface RegistrationBasicRead {
    tournament_id: number;
    category_id: number;
    id: number;
    user_id: number;
    registration_date: string;
    status: RegistrationStatus;
    payment_status: PaymentStatus;
  }
  
  export interface RegistrationCreate {
    tournament_id: number;
    category_id: number;
  }
  
  export interface RegistrationRead {
    tournament_id: number;
    category_id: number;
    id: number;
    user_id: number;
    registration_date: string;
    status: RegistrationStatus;
    payment_status: PaymentStatus;
    user: UserRead;
    tournament: TournamentBasicRead;
    category: TournamentCategoryBasicRead;
  }
  
  export interface RegistrationReadWithDetails {
    tournament_id: number;
    category_id: number;
    id: number;
    user_id: number;
    registration_date: string;
    status: RegistrationStatus;
    payment_status: PaymentStatus;
    user: UserRead;
    tournament: TournamentBasicRead;
    category: TournamentCategoryBasicRead;
  }
  
  export enum RegistrationStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
    Cancelled = "cancelled",
  }
  
  export interface RegistrationStatusUpdate {
    status: RegistrationStatus;
  }
  
  export interface Token {
    access_token: string;
    token_type: string;
  }
  
  export interface TournamentBasicRead {
    name: string;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_participants?: number | null;
    status?: TournamentStatus;
    id: number;
    created_by: number;
    created_at?: string | null;
    updated_at?: string | null;
  }
  
  export interface TournamentCategoryBasicRead {
    name: string;
    description?: string | null;
    age_min?: number | null;
    age_max?: number | null;
    gender?: string | null;
    weight_min?: number | null;
    weight_max?: number | null;
    max_participants?: number | null;
    id: number;
    tournament_id: number;
  }
  
  export interface TournamentCategoryCreate {
    name: string;
    description?: string | null;
    age_min?: number | null;
    age_max?: number | null;
    gender?: string | null;
    weight_min?: number | null;
    weight_max?: number | null;
    max_participants?: number | null;
  }
  
  export interface TournamentCategoryRead {
    name: string;
    description?: string | null;
    age_min?: number | null;
    age_max?: number | null;
    gender?: string | null;
    weight_min?: number | null;
    weight_max?: number | null;
    max_participants?: number | null;
    id: number;
    tournament_id: number;
    registrations?: RegistrationBasicRead[];
  }
  
  export interface TournamentCategoryUpdate {
    name?: string | null;
    description?: string | null;
    age_min?: number | null;
    age_max?: number | null;
    gender?: string | null;
    weight_min?: number | null;
    weight_max?: number | null;
    max_participants?: number | null;
  }
  
  export interface TournamentCreate {
    name: string;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_participants?: number | null;
    status?: TournamentStatus;
  }
  
  export interface TournamentRead {
    name: string;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_participants?: number | null;
    status?: TournamentStatus;
    id: number;
    created_by: number;
    created_at?: string | null;
    updated_at?: string | null;
    creator: UserRead;
    categories?: TournamentCategoryBasicRead[];
    registrations?: RegistrationBasicRead[];
  }
  
  export interface TournamentReadWithDetails {
    name: string;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_participants?: number | null;
    status?: TournamentStatus;
    id: number;
    created_by: number;
    created_at?: string | null;
    updated_at?: string | null;
    creator: UserRead;
    categories?: TournamentCategoryBasicRead[];
    registrations?: RegistrationBasicRead[];
  }
  
  export enum TournamentStatus {
    Draft = "draft",
    Open = "open",
    Closed = "closed",
    InProgress = "in_progress",
    Completed = "completed",
  }
  
  export interface TournamentUpdate {
    name?: string | null;
    description?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    registration_deadline?: string | null;
    max_participants?: number | null;
    status?: TournamentStatus | null;
  }
  
  export interface UserCreate {
    username: string;
    email: string;
    password: string;
    user_type_id: 0;
    full_name?: string | null;
    birth_date?: string | null;
    city?: string | null;
    gender?: GenderEnum | null;
    phone_number?: string | null;
  }
  
  export interface UserLogin {
    username: string;
    password: string;
  }
  
  export interface UserRead {
    username: string;
    email: string;
    full_name?: string | null;
    phone_number?: string | null;
    birth_date?: string | null;
    city?: string | null;
    gender?: GenderEnum | null;
    user_type_id?: number | null;
    id: number;
    created_at: string;
    updated_at: string;
    user_type?: UserTypeRead | null;
  }
  
  export interface UserTypeRead {
    name: string;
    id: number;
  }
  
  export interface UserUpdate {
    email?: string | null;
    full_name?: string | null;
    phone_number?: string | null;
    birth_date?: string | null;
    city?: string | null;
    gender?: GenderEnum | null;
  }
  
  export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
  }
export interface Home {}

export interface ActiveProgram {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  productIds: string[];
  variantId?: any;
  moneyback: boolean;
  question: boolean;
  foodRecommendations: boolean;
  duration: number;
}

export interface Datum {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  customerId?: number;
  weightQuestions: boolean;
  foodQuestions: boolean;
  sleepQuestions: boolean;
  moneyback: boolean;
  diagram: boolean;
  foodRecommendations: boolean;
  instagramFeed: boolean;
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  height?: number;
  initialWeight?: number;
  dietPlan?: any;
  currentWeight?: number;
  telegramChatId: number;
  requestMessageId?: number;
  telegramName: string;
  programRegistrationTimestamp?: Date;
  activeProgram: ActiveProgram;
}

export interface Info {
  currentPage: number;
  firstPage: number;
  limit: number;
  nextPage: number;
  offset: number;
  total: number;
  totalPages: number;
}

export interface CusSearchResObject {
  data: Datum[];
  info: Info;
}

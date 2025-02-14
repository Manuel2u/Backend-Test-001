import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  Email: { input: any; output: any; }
  Phone: { input: any; output: any; }
  Token: { input: any; output: any; }
};

export type ActionableStep = {
  __typename?: 'ActionableStep';
  completed: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  doctorNoteId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  scheduledAt?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type AuthenticatedResetPasswordInput = {
  confirmPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type BooleanOperator = {
  eq?: InputMaybe<Scalars['String']['input']>;
};

export enum Condition {
  And = 'and',
  Or = 'or'
}

export type CreateNoteInput = {
  doctorId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
};

export type DateOperator = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  notIn?: InputMaybe<Array<Scalars['Date']['input']>>;
};

export type Doctor = {
  __typename?: 'Doctor';
  available?: Maybe<Scalars['Boolean']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  specialization?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user: User;
};

export type DoctorFilter = {
  available?: InputMaybe<BooleanOperator>;
  id?: InputMaybe<IdOperator>;
  specialization?: InputMaybe<StringOperator>;
};

export type DoctorSort = {
  createdAt?: InputMaybe<Sort>;
  updatedAt?: InputMaybe<Sort>;
};

export type FindUserByEmailResult = {
  __typename?: 'FindUserByEmailResult';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type IdOperator = {
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type IntOperator = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type LoginMeta = {
  __typename?: 'LoginMeta';
  lastLoginAt?: Maybe<Scalars['Date']['output']>;
  lastLoginIp?: Maybe<Scalars['String']['output']>;
  lastLoginLocation?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkInReminder: Scalars['Boolean']['output'];
  createNote?: Maybe<Scalars['Boolean']['output']>;
  loginUser?: Maybe<UserAuthPayload>;
  selectDoctor?: Maybe<Scalars['Boolean']['output']>;
  signUpUser?: Maybe<UserAuthPayload>;
  updateDoctor?: Maybe<Doctor>;
  updatePatient?: Maybe<Patient>;
};


export type MutationCheckInReminderArgs = {
  reminderId: Scalars['ID']['input'];
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSelectDoctorArgs = {
  doctorId: Scalars['ID']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationSignUpUserArgs = {
  input: SignUpInput;
};


export type MutationUpdateDoctorArgs = {
  input: UpdateDoctorInput;
};


export type MutationUpdatePatientArgs = {
  input: UpdatePatientInput;
};

export type Note = {
  __typename?: 'Note';
  createdAt?: Maybe<Scalars['Date']['output']>;
  doctor?: Maybe<Doctor>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<Patient>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type NoteFilter = {
  doctorId?: InputMaybe<IdOperator>;
  patientId?: InputMaybe<IdOperator>;
};

export type NoteSort = {
  createdAt?: InputMaybe<Sort>;
  updatedAt?: InputMaybe<Sort>;
};

export type Pagination = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type Patient = {
  __typename?: 'Patient';
  bloodType?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  emergencyContact?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  user: User;
};

export type ProfessionalAuthPayload = {
  __typename?: 'ProfessionalAuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  getAllActionableSteps: Array<ActionableStep>;
  getAllAvailableDoctors?: Maybe<Array<Maybe<Doctor>>>;
  getAllAvailableDoctorsCount?: Maybe<Scalars['Int']['output']>;
  getAllReminders: Array<Reminder>;
  getNotes?: Maybe<Array<Maybe<Note>>>;
  getNotesCount?: Maybe<Scalars['Int']['output']>;
  getPatientsAssignedToDoctor?: Maybe<Array<Maybe<Patient>>>;
  getPatientsAssignedToDoctorCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryGetAllActionableStepsArgs = {
  doctorNoteId: Scalars['ID']['input'];
  pagination: Pagination;
};


export type QueryGetAllAvailableDoctorsArgs = {
  condition?: InputMaybe<Condition>;
  filter?: InputMaybe<DoctorFilter>;
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<DoctorSort>;
};


export type QueryGetAllAvailableDoctorsCountArgs = {
  condition?: InputMaybe<Condition>;
  filter?: InputMaybe<DoctorFilter>;
};


export type QueryGetAllRemindersArgs = {
  pagination: Pagination;
  patientId: Scalars['ID']['input'];
};


export type QueryGetNotesArgs = {
  condition?: InputMaybe<Condition>;
  filter?: InputMaybe<NoteFilter>;
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<NoteSort>;
};


export type QueryGetPatientsAssignedToDoctorArgs = {
  doctorId: Scalars['ID']['input'];
  pagination: Pagination;
};


export type QueryGetPatientsAssignedToDoctorCountArgs = {
  doctorId: Scalars['ID']['input'];
};

export type Reminder = {
  __typename?: 'Reminder';
  acknowledged: Scalars['Boolean']['output'];
  actionableStep: ActionableStep;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  patientId: Scalars['ID']['output'];
  reminderAt: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  hasAgreedToTermsAndAgreements: Scalars['Boolean']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userType: UserType;
};

export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperator = {
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  iLike?: InputMaybe<Scalars['String']['input']>;
  iRegex?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  like?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDoctorInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  doctorId: Scalars['ID']['input'];
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientInput = {
  bloodType?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  emergencyContact?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  accountMeta?: Maybe<UserAccountMeta>;
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  loginMeta?: Maybe<LoginMeta>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UserAccountMeta = {
  __typename?: 'UserAccountMeta';
  authType?: Maybe<Scalars['String']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  status?: Maybe<UserAccountStatus>;
};

export enum UserAccountStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED'
}

export type UserAuthPayload = {
  __typename?: 'UserAuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export enum UserType {
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

export type VerifyCodeResult = {
  __typename?: 'verifyCodeResult';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionableStep: ResolverTypeWrapper<ActionableStep>;
  AuthenticatedResetPasswordInput: AuthenticatedResetPasswordInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BooleanOperator: BooleanOperator;
  Condition: Condition;
  CreateNoteInput: CreateNoteInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateOperator: DateOperator;
  Doctor: ResolverTypeWrapper<Doctor>;
  DoctorFilter: DoctorFilter;
  DoctorSort: DoctorSort;
  Email: ResolverTypeWrapper<Scalars['Email']['output']>;
  FindUserByEmailResult: ResolverTypeWrapper<FindUserByEmailResult>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IdOperator: IdOperator;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntOperator: IntOperator;
  LoginMeta: ResolverTypeWrapper<LoginMeta>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteFilter: NoteFilter;
  NoteSort: NoteSort;
  Pagination: Pagination;
  Patient: ResolverTypeWrapper<Patient>;
  Phone: ResolverTypeWrapper<Scalars['Phone']['output']>;
  ProfessionalAuthPayload: ResolverTypeWrapper<ProfessionalAuthPayload>;
  Query: ResolverTypeWrapper<{}>;
  Reminder: ResolverTypeWrapper<Reminder>;
  SignUpInput: SignUpInput;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringOperator: StringOperator;
  Token: ResolverTypeWrapper<Scalars['Token']['output']>;
  UpdateDoctorInput: UpdateDoctorInput;
  UpdatePatientInput: UpdatePatientInput;
  User: ResolverTypeWrapper<User>;
  UserAccountMeta: ResolverTypeWrapper<UserAccountMeta>;
  UserAccountStatus: UserAccountStatus;
  UserAuthPayload: ResolverTypeWrapper<UserAuthPayload>;
  UserType: UserType;
  verifyCodeResult: ResolverTypeWrapper<VerifyCodeResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActionableStep: ActionableStep;
  AuthenticatedResetPasswordInput: AuthenticatedResetPasswordInput;
  Boolean: Scalars['Boolean']['output'];
  BooleanOperator: BooleanOperator;
  CreateNoteInput: CreateNoteInput;
  Date: Scalars['Date']['output'];
  DateOperator: DateOperator;
  Doctor: Doctor;
  DoctorFilter: DoctorFilter;
  DoctorSort: DoctorSort;
  Email: Scalars['Email']['output'];
  FindUserByEmailResult: FindUserByEmailResult;
  ID: Scalars['ID']['output'];
  IdOperator: IdOperator;
  Int: Scalars['Int']['output'];
  IntOperator: IntOperator;
  LoginMeta: LoginMeta;
  Mutation: {};
  Note: Note;
  NoteFilter: NoteFilter;
  NoteSort: NoteSort;
  Pagination: Pagination;
  Patient: Patient;
  Phone: Scalars['Phone']['output'];
  ProfessionalAuthPayload: ProfessionalAuthPayload;
  Query: {};
  Reminder: Reminder;
  SignUpInput: SignUpInput;
  String: Scalars['String']['output'];
  StringOperator: StringOperator;
  Token: Scalars['Token']['output'];
  UpdateDoctorInput: UpdateDoctorInput;
  UpdatePatientInput: UpdatePatientInput;
  User: User;
  UserAccountMeta: UserAccountMeta;
  UserAuthPayload: UserAuthPayload;
  verifyCodeResult: VerifyCodeResult;
};

export type ActionableStepResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionableStep'] = ResolversParentTypes['ActionableStep']> = {
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  doctorNoteId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  scheduledAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DoctorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Doctor'] = ResolversParentTypes['Doctor']> = {
  available?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  specialization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface EmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Email'], any> {
  name: 'Email';
}

export type FindUserByEmailResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FindUserByEmailResult'] = ResolversParentTypes['FindUserByEmailResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginMeta'] = ResolversParentTypes['LoginMeta']> = {
  lastLoginAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  lastLoginIp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastLoginLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  checkInReminder?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCheckInReminderArgs, 'reminderId'>>;
  createNote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'input'>>;
  loginUser?: Resolver<Maybe<ResolversTypes['UserAuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'email' | 'password'>>;
  selectDoctor?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSelectDoctorArgs, 'doctorId' | 'patientId'>>;
  signUpUser?: Resolver<Maybe<ResolversTypes['UserAuthPayload']>, ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'input'>>;
  updateDoctor?: Resolver<Maybe<ResolversTypes['Doctor']>, ParentType, ContextType, RequireFields<MutationUpdateDoctorArgs, 'input'>>;
  updatePatient?: Resolver<Maybe<ResolversTypes['Patient']>, ParentType, ContextType, RequireFields<MutationUpdatePatientArgs, 'input'>>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  doctor?: Resolver<Maybe<ResolversTypes['Doctor']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  patient?: Resolver<Maybe<ResolversTypes['Patient']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PatientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Patient'] = ResolversParentTypes['Patient']> = {
  bloodType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateOfBirth?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emergencyContact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Phone'], any> {
  name: 'Phone';
}

export type ProfessionalAuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfessionalAuthPayload'] = ResolversParentTypes['ProfessionalAuthPayload']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllActionableSteps?: Resolver<Array<ResolversTypes['ActionableStep']>, ParentType, ContextType, RequireFields<QueryGetAllActionableStepsArgs, 'doctorNoteId' | 'pagination'>>;
  getAllAvailableDoctors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Doctor']>>>, ParentType, ContextType, Partial<QueryGetAllAvailableDoctorsArgs>>;
  getAllAvailableDoctorsCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<QueryGetAllAvailableDoctorsCountArgs>>;
  getAllReminders?: Resolver<Array<ResolversTypes['Reminder']>, ParentType, ContextType, RequireFields<QueryGetAllRemindersArgs, 'pagination' | 'patientId'>>;
  getNotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Note']>>>, ParentType, ContextType, Partial<QueryGetNotesArgs>>;
  getNotesCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  getPatientsAssignedToDoctor?: Resolver<Maybe<Array<Maybe<ResolversTypes['Patient']>>>, ParentType, ContextType, RequireFields<QueryGetPatientsAssignedToDoctorArgs, 'doctorId' | 'pagination'>>;
  getPatientsAssignedToDoctorCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<QueryGetPatientsAssignedToDoctorCountArgs, 'doctorId'>>;
};

export type ReminderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reminder'] = ResolversParentTypes['Reminder']> = {
  acknowledged?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  actionableStep?: Resolver<ResolversTypes['ActionableStep'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  patientId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reminderAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TokenScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Token'], any> {
  name: 'Token';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  accountMeta?: Resolver<Maybe<ResolversTypes['UserAccountMeta']>, ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  loginMeta?: Resolver<Maybe<ResolversTypes['LoginMeta']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAccountMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccountMeta'] = ResolversParentTypes['UserAccountMeta']> = {
  authType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isEmailVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['UserAccountStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAuthPayload'] = ResolversParentTypes['UserAuthPayload']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifyCodeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['verifyCodeResult'] = ResolversParentTypes['verifyCodeResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActionableStep?: ActionableStepResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Doctor?: DoctorResolvers<ContextType>;
  Email?: GraphQLScalarType;
  FindUserByEmailResult?: FindUserByEmailResultResolvers<ContextType>;
  LoginMeta?: LoginMetaResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  Patient?: PatientResolvers<ContextType>;
  Phone?: GraphQLScalarType;
  ProfessionalAuthPayload?: ProfessionalAuthPayloadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reminder?: ReminderResolvers<ContextType>;
  Token?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserAccountMeta?: UserAccountMetaResolvers<ContextType>;
  UserAuthPayload?: UserAuthPayloadResolvers<ContextType>;
  verifyCodeResult?: VerifyCodeResultResolvers<ContextType>;
};


import { z } from 'zod';
import { USERNAME_REGEX } from './regex';

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      USERNAME_REGEX,
      'Use lowercase letters, numbers, underscores, or dots. Include at least one letter.',
    ),
});

export const birthDateGenderSchema = z.object({
  birth_date: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say'], {
    message: 'Please select a gender',
  }),
});

export const emailPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const editProfileSchema = z.object({
  avatar_url: z.string().nullable().optional(),
  background_url: z.string().nullable().optional(),
});

export const editBioSchema = z.object({
  bio: z.string().max(160, 'Bio must be at most 160 characters'),
});

export const editInstagramSchema = z.object({
  instagram_username: z
    .string()
    .max(30, 'Instagram username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9._]*$/, 'Only letters, numbers, periods, and underscores'),
});

export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  address_details: z.string().optional(),
  is_default: z.boolean().default(false),
});

export const sellerApplicationSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  instagram_link: z.string().url('Must be a valid URL').min(1, 'Instagram link is required'),
  height: z.string().min(1, 'Height is required'),
  intro: z.string().optional(),
  sample_photos: z.array(z.string()).optional(),
});

const CATEGORIES = [
  'Shirts', 'Tops', 'Hoodies', 'Jackets', 'Cardigans', 'Pants', 'Jeans',
  'Skirts', 'Shoes', 'Earrings', 'Necklaces', 'Watches', 'Bags', 'Accessories', 'Others',
] as const;

const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;

const DAMAGE_OPTIONS = [
  'No damage', 'Stain', 'Tear / hole', 'Fading', 'Scratches', 'Missing parts', 'Other',
] as const;

export const createListingSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(CATEGORIES, { message: 'Category is required' }),
  size: z.string().min(1, 'Size is required'),
  condition: z.enum(CONDITIONS, { message: 'Condition is required' }),
  price: z.number().positive('Price must be greater than 0'),
  description: z.string().optional(),
  damage_type: z.enum(DAMAGE_OPTIONS).optional(),
  damage_details: z.string().optional(),
  material: z.string().optional(),
  measurements: z.string().optional(),
});

export type UsernameForm = z.infer<typeof usernameSchema>;
export type BirthDateGenderForm = z.infer<typeof birthDateGenderSchema>;
export type EmailPasswordForm = z.infer<typeof emailPasswordSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type EditProfileForm = z.infer<typeof editProfileSchema>;
export type EditBioForm = z.infer<typeof editBioSchema>;
export type EditInstagramForm = z.infer<typeof editInstagramSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type SellerApplicationForm = z.infer<typeof sellerApplicationSchema>;
export type CreateListingForm = z.infer<typeof createListingSchema>;

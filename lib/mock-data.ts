import type { Tables } from '@/types/database';
import type { ItemWithMedia } from '@/services/items';

const UNSPLASH = 'https://images.unsplash.com';

export const MOCK_USERS: Tables<'users'>[] = [
  {
    id: 'mock-user-1',
    username: 'sofia.reyes',
    email: 'sofia@cura.app',
    birth_date: '1998-03-15',
    gender: 'Female',
    avatar_url: `${UNSPLASH}/photo-1534528741775-53994a69daeb?w=400`,
    background_url: `${UNSPLASH}/photo-1507003211169-0a1dd7228f2d?w=800`,
    instagram_link: 'https://instagram.com/sofiareyes',
    bio: 'Designers focused on creating impactful, user-centered digital experiences and branding.',
    is_onboarded: true,
    is_seller: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'mock-user-2',
    username: 'kai.nakamura',
    email: 'kai@cura.app',
    birth_date: '1995-08-22',
    gender: 'Male',
    avatar_url: `${UNSPLASH}/photo-1506794778202-cad84cf45f1d?w=400`,
    background_url: `${UNSPLASH}/photo-1558618666-fcd25c85f82e?w=800`,
    instagram_link: 'https://instagram.com/kainakamura',
    bio: 'Vintage collector. Minimalist wardrobe. Tokyo ↔ Manila.',
    is_onboarded: true,
    is_seller: true,
    created_at: '2024-06-15T00:00:00Z',
    updated_at: '2024-06-15T00:00:00Z',
  },
  {
    id: 'mock-user-3',
    username: 'mara.santos',
    email: 'mara@cura.app',
    birth_date: '2000-11-03',
    gender: 'Female',
    avatar_url: `${UNSPLASH}/photo-1531746020798-e6953c6e8e04?w=400`,
    background_url: `${UNSPLASH}/photo-1470813740244-df37b8c1edcb?w=800`,
    instagram_link: 'https://instagram.com/marasantos',
    bio: 'Y2K enthusiast. Styling secondhand into something new.',
    is_onboarded: true,
    is_seller: true,
    created_at: '2024-10-20T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: 'mock-user-4',
    username: 'jude.alarcon',
    email: 'jude@cura.app',
    birth_date: '1997-05-10',
    gender: 'Male',
    avatar_url: `${UNSPLASH}/photo-1507003211169-0a1dd7228f2d?w=400`,
    background_url: `${UNSPLASH}/photo-1536924940846-227afb31e2a5?w=800`,
    instagram_link: null,
    bio: 'Streetwear curator. Less is more.',
    is_onboarded: true,
    is_seller: true,
    created_at: '2024-07-08T00:00:00Z',
    updated_at: '2024-07-08T00:00:00Z',
  },
];

const FASHION_IMAGES = [
  `${UNSPLASH}/photo-1551028719-00167b16eac5?w=600`,
  `${UNSPLASH}/photo-1598300042247-d088f8ab3a91?w=600`,
  `${UNSPLASH}/photo-1591047139829-d91aecb6caea?w=600`,
  `${UNSPLASH}/photo-1618354691373-d851c5c3a990?w=600`,
  `${UNSPLASH}/photo-1558171813-01ded89a4b10?w=600`,
  `${UNSPLASH}/photo-1556905055-8f358a7a47b2?w=600`,
  `${UNSPLASH}/photo-1525507119028-ed4c629a60a3?w=600`,
  `${UNSPLASH}/photo-1515886657613-9f3515b0c78f?w=600`,
  `${UNSPLASH}/photo-1509631179647-0177331693ae?w=600`,
  `${UNSPLASH}/photo-1578587018452-892bacefd3f2?w=600`,
  `${UNSPLASH}/photo-1594938328870-9623159c8c99?w=600`,
  `${UNSPLASH}/photo-1552374196-1ab2a1c593e8?w=600`,
];

function makeMedia(itemId: string, imageIndex: number): Tables<'item_media'> {
  return {
    id: `media-${itemId}`,
    item_id: itemId,
    url: FASHION_IMAGES[imageIndex % FASHION_IMAGES.length],
    sort_order: 0,
    created_at: '2024-11-01T00:00:00Z',
  };
}

function makeItem(
  id: string,
  seller: Tables<'users'>,
  name: string,
  brand: string,
  price: number,
  category: string,
  size: string,
  condition: string,
  imageIndex: number,
  description?: string
): ItemWithMedia {
  return {
    id,
    seller_id: seller.id,
    item_name: name,
    brand,
    category,
    size,
    condition,
    price,
    description: description ?? null,
    damage_type: 'No damage',
    damage_details: null,
    material: null,
    measurements: null,
    status: 'active',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
    item_media: [makeMedia(id, imageIndex)],
    seller,
  };
}

export const MOCK_ITEMS: ItemWithMedia[] = [
  makeItem('item-1', MOCK_USERS[0], 'Vintage Silk Blouse', 'Zara', 1850, 'Tops', 'S', 'Like new', 0, 'Gorgeous cream silk blouse with delicate pleating. Worn once for a photoshoot.'),
  makeItem('item-2', MOCK_USERS[1], 'Oversized Denim Jacket', 'Levi\'s', 2400, 'Outerwear', 'L', 'Good', 1, 'Classic 90s oversized fit. Slight fading adds character.'),
  makeItem('item-3', MOCK_USERS[2], 'Pleated Midi Skirt', 'Uniqlo', 950, 'Bottoms', 'M', 'Like new', 2),
  makeItem('item-4', MOCK_USERS[0], 'Knit Cardigan', 'COS', 1650, 'Outerwear', 'M', 'Like new', 3, 'Soft chunky knit in oatmeal. Perfect layering piece for any season.'),
  makeItem('item-5', MOCK_USERS[3], 'Wide Leg Trousers', 'Muji', 1200, 'Bottoms', 'M', 'Good', 4),
  makeItem('item-6', MOCK_USERS[1], 'Linen Button-Down', 'H&M', 780, 'Tops', 'L', 'Like new', 5, 'Relaxed fit linen shirt. Great for summer layering.'),
  makeItem('item-7', MOCK_USERS[2], 'Platform Loafers', 'Dr. Martens', 3200, 'Shoes', 'US 7', 'Good', 6),
  makeItem('item-8', MOCK_USERS[3], 'Cropped Blazer', 'Mango', 1900, 'Outerwear', 'S', 'Like new', 7, 'Sharp cropped silhouette. Great paired with wide-leg pants.'),
  makeItem('item-9', MOCK_USERS[0], 'Mesh Tank Top', 'Weekday', 550, 'Tops', 'XS', 'Brand new', 8),
  makeItem('item-10', MOCK_USERS[1], 'Corduroy Trousers', 'Uniqlo', 1100, 'Bottoms', 'M', 'Good', 9),
  makeItem('item-11', MOCK_USERS[2], 'Satin Cami Dress', 'Zara', 2100, 'Dresses', 'S', 'Like new', 10, 'Beautiful bias-cut satin dress. Champagne color.'),
  makeItem('item-12', MOCK_USERS[3], 'Cargo Pants', 'Carhartt WIP', 2800, 'Bottoms', 'L', 'Good', 11),
];

export const MOCK_FOLLOWER_COUNTS: Record<string, number> = {
  'mock-user-1': 24300,
  'mock-user-2': 8750,
  'mock-user-3': 12100,
  'mock-user-4': 3420,
};

export const MOCK_FOLLOWING_COUNTS: Record<string, number> = {
  'mock-user-1': 252,
  'mock-user-2': 180,
  'mock-user-3': 345,
  'mock-user-4': 97,
};

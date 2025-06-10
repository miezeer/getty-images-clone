import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// New Database types for the stock photo platform
export interface StockUser {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'user' | 'premium'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface StockImage {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail_url: string | null
  photographer: string
  type: 'photo' | 'video' | 'illustration' | 'vector'
  category: string
  tags: string[]
  premium: boolean
  width: number | null
  height: number | null
  file_size: number | null
  upload_date: string | null
  uploaded_by: string | null
  download_count: number | null
  created_at: string
  updated_at: string
}

export interface StockCollection {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  cover_image_id: string | null
  created_at: string
  updated_at: string
}

export interface StockDownload {
  id: string
  user_id: string
  image_id: string
  download_type: 'free' | 'premium' | 'purchase'
  resolution: string | null
  downloaded_at: string
  price_paid: number | null
}

export interface StockFavorite {
  id: string
  user_id: string
  image_id: string
  created_at: string
}

// Helper functions for database operations
export const supabaseHelpers = {
  // Images
  async getImages(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('stock_images')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data, error }
  },

  async searchImages(query: string, category?: string, type?: string) {
    let queryBuilder = supabase
      .from('stock_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (type && type !== 'all') {
      queryBuilder = queryBuilder.eq('type', type)
    }

    const { data, error } = await queryBuilder
    return { data, error }
  },

  async getImageById(id: string) {
    const { data, error } = await supabase
      .from('stock_images')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  },

  // Collections
  async getUserCollections(userId: string) {
    const { data, error } = await supabase
      .from('stock_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async getPublicCollections() {
    const { data, error } = await supabase
      .from('stock_collections')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Downloads
  async createDownload(download: Omit<StockDownload, 'id' | 'downloaded_at'>) {
    const { data, error } = await supabase
      .from('stock_downloads')
      .insert(download)
      .select()
      .single()

    return { data, error }
  },

  async getUserDownloads(userId: string) {
    const { data, error } = await supabase
      .from('stock_downloads')
      .select(`
        *,
        stock_images (*)
      `)
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false })

    return { data, error }
  },

  // Favorites
  async addToFavorites(userId: string, imageId: string) {
    const { data, error } = await supabase
      .from('stock_favorites')
      .insert({ user_id: userId, image_id: imageId })
      .select()
      .single()

    return { data, error }
  },

  async removeFromFavorites(userId: string, imageId: string) {
    const { data, error } = await supabase
      .from('stock_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('image_id', imageId)

    return { data, error }
  },

  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('stock_favorites')
      .select(`
        *,
        stock_images (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Storage helpers
  async uploadImage(file: File, userId: string, type: 'images' | 'thumbnails' = 'images') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const bucketName = type === 'images' ? 'stock-images' : 'stock-thumbnails'

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file)

    if (error) return { data: null, error }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return { data: { ...data, publicUrl: urlData.publicUrl }, error: null }
  },

  getImageUrl(path: string, bucket: 'stock-images' | 'stock-thumbnails' = 'stock-images') {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }
}

// Legacy types for backward compatibility
export interface ImageRow {
  id: string
  title: string
  description: string | null
  url: string
  photographer: string
  type: 'photo' | 'video' | 'illustration' | 'vector'
  category: string
  tags: string[]
  premium: boolean
  width: number
  height: number
  upload_date: string
  created_at: string
  updated_at: string
}

export interface ImageInsert {
  id?: string
  title: string
  description?: string | null
  url: string
  photographer: string
  type: 'photo' | 'video' | 'illustration' | 'vector'
  category: string
  tags: string[]
  premium?: boolean
  width: number
  height: number
  upload_date?: string
}

export interface UserRow {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'user' | 'premium'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface CollectionRow {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface UserCollectionRow {
  id: string
  user_id: string
  collection_id: string
  image_id: string
  added_at: string
}

export interface DownloadRow {
  id: string
  user_id: string
  image_id: string
  download_type: 'free' | 'premium' | 'purchase'
  resolution: string
  downloaded_at: string
  price_paid: number | null
}

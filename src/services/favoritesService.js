const FAVORITES_KEY = 'astronope_favorites'

/**
 * Get all favorite excuses
 */
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Error reading favorites:', error)
    return []
  }
}

/**
 * Add an excuse to favorites
 */
export function addFavorite(excuse) {
  try {
    const favorites = getFavorites()
    if (!favorites.includes(excuse)) {
      favorites.push(excuse)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
    return favorites
  } catch (error) {
    console.error('Error saving favorite:', error)
    return getFavorites()
  }
}

/**
 * Remove an excuse from favorites
 */
export function removeFavorite(excuse) {
  try {
    const favorites = getFavorites()
    const filtered = favorites.filter(fav => fav !== excuse)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
    return filtered
  } catch (error) {
    console.error('Error removing favorite:', error)
    return getFavorites()
  }
}

/**
 * Check if an excuse is favorited
 */
export function isFavorite(excuse) {
  const favorites = getFavorites()
  return favorites.includes(excuse)
}

/**
 * Clear all favorites
 */
export function clearFavorites() {
  try {
    localStorage.removeItem(FAVORITES_KEY)
  } catch (error) {
    console.error('Error clearing favorites:', error)
  }
}


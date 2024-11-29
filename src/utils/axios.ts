import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add API key to query parameters
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Ensure params object exists
    config.params = config.params || {}
    // Add API key to params
    config.params['apiKey'] = import.meta.env.VITE_API_KEY as string
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // You can add any response preprocessing here
    return response
  },
  (error: any) => {
    // Handle errors here
    return Promise.reject(error)
  }
)

// Interface for recipe search parameters
interface RecipeSearchParams {
    query: string
    number?: number
    offset?: number
    fillIngredients?: boolean
    addRecipeInformation?: boolean
    addRecipeInstructions?: boolean
    addRecipeNutrition?: boolean
    sort?: string
    sortDirection?: string
  }
  
  // Function to search recipes with complex parameters
  async function searchRecipes({
    query,
    sort,
    sortDirection,
    number = 12,
    offset = 0,
    fillIngredients = true,
    addRecipeInformation = true,
    addRecipeInstructions = true,
    addRecipeNutrition = true
  }: RecipeSearchParams): Promise<AxiosResponse<any>> {
    return api.get('/recipes/complexSearch', {
      params: {
        query,
        sort,
        sortDirection,
        number,
        offset,
        fillIngredients,
        addRecipeInformation,
        addRecipeInstructions,
        addRecipeNutrition
      }
    })
  }

  async function searchBookmarks({
    ids,
    includeNutrition = true
  }: { ids: number[], includeNutrition: boolean }): Promise<AxiosResponse<any>> {
    return api.get('/recipes/informationBulk', {
      params: {
        ids,
        includeNutrition
      }
    })
  }
  
  export default api
  export { searchRecipes, searchBookmarks }
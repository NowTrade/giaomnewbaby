import { createBrowserClient } from "@supabase/ssr"

// Create a chainable mock query builder
function createMockQueryBuilder() {
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (value: { data: never[], error: null }) => void) => resolve({ data: [], error: null }),
  }
  return builder
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null so components can check and use demo data
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

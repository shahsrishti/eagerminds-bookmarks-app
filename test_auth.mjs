import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxfcuivntuaykjrssqys.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d3BwaW9mcnJrcG5mYWdkZG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzU2MjAsImV4cCI6MjA5NjMxMTYyMH0.vXETtKo83wbRul59f0xeeajHKaW-R7cnvfX7aS9zQ7c'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log("Testing Signup...");
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: 'test_user_12345@example.com',
    password: 'Password123!',
  })
  if (signupError) {
    console.error("Signup failed:", signupError)
  } else {
    console.log("Signup succeeded:", signupData.user?.id)
    
    console.log("Testing Login...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test_user_12345@example.com',
      password: 'Password123!',
    })
    
    if (loginError) {
      console.error("Login failed:", loginError)
    } else {
      console.log("Login succeeded:", loginData.user?.id)
    }
  }
}

testAuth()

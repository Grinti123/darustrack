import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'
import Illustration from '../assets/Illustration.svg'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setError('')
      setLoading(true)
      const user = await login(email, password)

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/dashboard')
          break
        case 'wali_kelas':
          navigate('/dashboard')
          break
        case 'orang_tua':
          navigate('/dashboard')
          break
        case 'kepala_sekolah':
          console.log('Logged in as Kepala Sekolah:', user)
          navigate('/dashboard')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header/Top Bar */}


      {/* Blue Banner with Logo and School Name */}
      <div className="bg-primary text-white p-4">
        <div className="container d-flex align-items-center">
          <img src={logo} alt="School Logo" className="me-3" height="60" />
          <div>
            <h1 className="fs-2 mb-0">SDIT 01 Darussalam Batam</h1>
            <p className="mb-0 small">Mempertahankan Kebaikan Kebaikan Lama Mengembangkan hal hal baru yang lebih baik</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0 me-4">
                      <img src={Illustration} alt="Login Illustration" width="200" />
                    </div>
                    <div className="flex-grow-1">
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                          />
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">Forgot My Password</small>
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? 'Signing In...' : 'Sign In'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

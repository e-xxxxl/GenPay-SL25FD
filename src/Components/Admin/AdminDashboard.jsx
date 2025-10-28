"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  FileText,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  Mail
} from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardData, setDashboardData] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hosts, setHosts] = useState([])
  const [payouts, setPayouts] = useState([])
  const [payoutHistory, setPayoutHistory] = useState([])
  const [selectedHost, setSelectedHost] = useState(null)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [approvalForm, setApprovalForm] = useState({
    approvedAmount: "",
    notes: "",
    proofOfPayment: null
  })

  const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com"

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchDashboardData()
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [navigate])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('adminToken')
    
    try {
      // Fetch admin data
      const adminResponse = await fetch(`${API_BASE_URL}/api/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!adminResponse.ok) throw new Error('Failed to fetch admin data')
      const adminResult = await adminResponse.json()
      setAdminData(adminResult.data.admin)

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (statsResponse.ok) {
        const statsResult = await statsResponse.json()
        setDashboardData(statsResult.data)
      }

      // Fetch hosts data
      const hostsResponse = await fetch(`${API_BASE_URL}/api/admin/hosts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (hostsResponse.ok) {
        const hostsResult = await hostsResponse.json()
        setHosts(hostsResult.data.hosts || [])
      }

      // Fetch pending payouts
      const payoutsResponse = await fetch(`${API_BASE_URL}/api/admin/payouts/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (payoutsResponse.ok) {
        const payoutsResult = await payoutsResponse.json()
        setPayouts(payoutsResult.data.payouts || [])
      }

      // Fetch payout history
      const historyResponse = await fetch(`${API_BASE_URL}/api/admin/payouts/approval-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (historyResponse.ok) {
        const historyResult = await historyResponse.json()
        setPayoutHistory(historyResult.data.approvals || [])
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken')
    
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      navigate('/admin/login')
    }
  }

 const handleApprovePayout = async (e) => {
  e.preventDefault()
  const token = localStorage.getItem('adminToken')
  
  try {
    const formData = new FormData()
    formData.append('payoutId', selectedPayout._id)
    formData.append('approvedAmount', approvalForm.approvedAmount)
    formData.append('notes', approvalForm.notes)
    
    if (approvalForm.proofOfPayment) {
      formData.append('proofOfPayment', approvalForm.proofOfPayment)
    }

    console.log('Sending form data:', {
      payoutId: selectedPayout._id,
      approvedAmount: approvalForm.approvedAmount,
      notes: approvalForm.notes,
      hasFile: !!approvalForm.proofOfPayment
    })

    const response = await fetch(`${API_BASE_URL}/api/admin/payouts/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to approve payout')
    }

    const result = await response.json()
    console.log('Payout approved successfully:', result)
    
    setShowPayoutModal(false)
    setApprovalForm({ approvedAmount: "", notes: "", proofOfPayment: null })
    setSelectedPayout(null)
    fetchDashboardData()
    
  } catch (error) {
    console.error('Approve payout error:', error)
    alert(error.message)
  }
}

  const handleRejectPayout = async (payoutId, reason) => {
    const token = localStorage.getItem('adminToken')
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payouts/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payoutId, reason })
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
        alert('Payout rejected successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reject payout')
      }
    } catch (error) {
      console.error('Reject payout error:', error)
      alert(error.message)
    }
  }

  const formatNaira = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "hosts", label: "Hosts", icon: Users },
    { id: "payouts", label: "Payouts", icon: CreditCard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "logs", label: "Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-900 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">Genpay Admin</h1>
            <p className="text-gray-400 text-sm">Management Panel</p>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-purple-600 to-red-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center">
                <span className="font-bold">{adminData?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white font-medium">{adminData?.name}</p>
                <p className="text-gray-400 text-sm">{adminData?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : 
               activeTab === 'hosts' ? 'Host Management' :
               activeTab === 'payouts' ? 'Payout Management' :
               activeTab === 'events' ? 'Event Management' :
               activeTab === 'logs' ? 'System Logs' : 'Settings'}
            </h1>
            <p className="text-gray-400">
              {getGreeting()}, {adminData?.name}. {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings Today</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNaira(dashboardData?.totalEarningsToday || 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CreditCard className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Payouts</p>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData?.pendingPayouts || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <Users className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Hosts</p>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData?.activeHosts || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Live Events</p>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData?.liveEvents || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Financial Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Genpay Cut:</span>
                      <span className="text-white">{formatNaira(dashboardData?.genpaycut || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Paystack Cut:</span>
                      <span className="text-white">{formatNaira(dashboardData?.paystackCut || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-3">
                      <span className="text-gray-400 font-semibold">Net Holding:</span>
                      <span className="text-white font-semibold">{formatNaira(dashboardData?.netHolding || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Staff Status */}
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Status</h3>
                  <div className="space-y-3">
                    {dashboardData?.staffMembers?.map((staff, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-white">{staff.name}</p>
                          <p className="text-gray-400 text-sm">{staff.role}</p>
                        </div>
                        <div className={`flex items-center space-x-2 ${staff.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${staff.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">{staff.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('payouts')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <CreditCard className="h-6 w-6 text-purple-400 mb-2" />
                    <p className="text-white font-medium">Review Payouts</p>
                    <p className="text-gray-400 text-sm">{dashboardData?.pendingPayouts || 0} pending</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('hosts')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <Users className="h-6 w-6 text-blue-400 mb-2" />
                    <p className="text-white font-medium">Manage Hosts</p>
                    <p className="text-gray-400 text-sm">{dashboardData?.activeHosts || 0} active</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <Calendar className="h-6 w-6 text-green-400 mb-2" />
                    <p className="text-white font-medium">View Events</p>
                    <p className="text-gray-400 text-sm">{dashboardData?.liveEvents || 0} live</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hosts Tab */}
          {activeTab === 'hosts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search hosts..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Host</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Events</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Balance</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hosts.map((host) => (
                      <tr key={host._id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{host.displayName}</p>
                            <p className="text-gray-400 text-sm">{host.location}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{host.email}</td>
                        <td className="p-4 text-gray-300">{host.totalEvents || 0}</td>
                        <td className="p-4 text-white font-medium">{formatNaira(host.availableBalance || 0)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            host.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {host.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => setSelectedHost(host)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pending Payouts ({payouts.length})</h2>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                {payouts.map((payout) => (
                  <div key={payout._id} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {payout.host?.displayName} - {formatNaira(payout.amount)}
                        </h3>
                        <p className="text-gray-400">{payout.host?.email}</p>
                        <p className="text-gray-400 text-sm">Requested: {formatDate(payout.createdAt)}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Bank Details</p>
                        <p className="text-white">{payout.bankDetails?.bankName}</p>
                        <p className="text-gray-300">{payout.bankDetails?.accountNumber} - {payout.bankDetails?.accountName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Breakdown</p>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>{formatNaira(payout.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee:</span>
                          <span>{formatNaira(payout.fee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Net Amount:</span>
                          <span>{formatNaira(payout.netAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedPayout(payout)
                          setApprovalForm({ approvedAmount: payout.amount, notes: "", proofOfPayment: null })
                          setShowPayoutModal(true)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve Payout</span>
                      </button>
                      <button
                        onClick={() => handleRejectPayout(payout._id, "Manual rejection by admin")}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}

                {payouts.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No pending payouts</p>
                  </div>
                )}
              </div>

              {/* Payout History Section */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Payout History ({payoutHistory.length})</h2>
                <div className="grid gap-6">
                  {payoutHistory.map((approval) => {
                    const payout = approval.payout || {}
                    const host = payout.host || {}
                    return (
                      <div key={approval._id} className="bg-gray-900 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {host.displayName} - {formatNaira(approval.approvedAmount)}
                            </h3>
                            <p className="text-gray-400">{host.email}</p>
                            <p className="text-gray-400 text-sm">Processed: {formatDate(approval.approvalDate)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            approval.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">Bank Details</p>
                            <p className="text-white">{payout.bankDetails?.bankName}</p>
                            <p className="text-gray-300">{payout.bankDetails?.accountNumber} - {payout.bankDetails?.accountName}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Breakdown</p>
                            <div className="flex justify-between">
                              <span>Approved Amount:</span>
                              <span>{formatNaira(approval.approvedAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fee:</span>
                              <span>{formatNaira(payout.fee)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Net Amount:</span>
                              <span>{formatNaira(approval.approvedAmount - payout.fee)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-400 text-sm">Notes:</p>
                          <p className="text-gray-300">{approval.notes || 'No notes provided'}</p>
                        </div>

                        {approval.proofOfPayment?.imageUrl && (
                          <div className="mt-4">
                            <p className="text-gray-400 text-sm">Proof of Payment:</p>
                            <a 
                              href={approval.proofOfPayment.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 flex items-center space-x-2 mt-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Proof</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {payoutHistory.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No payout history</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab === 'events' && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Event management coming soon</p>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">System logs coming soon</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Settings coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Payout Approval Modal */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Approve Payout</h3>
            
            <form onSubmit={handleApprovePayout} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Approved Amount</label>
                <input
                  type="number"
                  value={approvalForm.approvedAmount}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, approvedAmount: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Notes</label>
                <textarea
                  value={approvalForm.notes}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-purple-500"
                  rows="3"
                  placeholder="Add any notes for the host..."
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Proof of Payment</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center mt-1">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Upload proof of payment</p>
                  <input
                    type="file"
                    onChange={(e) => setApprovalForm(prev => ({ ...prev, proofOfPayment: e.target.files[0] }))}
                    className="hidden"
                    id="proofUpload"
                  />
                  <label htmlFor="proofUpload" className="text-purple-400 text-sm cursor-pointer">
                    Choose file
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
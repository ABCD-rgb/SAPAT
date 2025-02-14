function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center md:items-start">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-deepbrown" />
        <span className="text-2xl font-bold text-deepbrown">{value}</span>
      </div>
      <span className="text-darkbrown mt-1">{label}</span>
    </div>
  )
}

export default StatCard
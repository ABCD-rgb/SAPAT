export default function Selection({ name, color }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-5 w-5 rounded-full"
        style={{
          borderColor: color, // Dynamically set the border color
        }}
        className="border-2"
      />
      <div
        className="rounded-full px-2 py-1 text-sm text-white"
        style={{
          backgroundColor: color, // Dynamically set the background color of the name box
        }}
      >
        {name}
      </div>
    </div>
  )
}

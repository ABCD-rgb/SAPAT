export default function Selection({ name, color }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-full"
        style={{
          borderColor: color, // Dynamically set the border color
        }}
        className="border-2"
      />
      <div
        className="px-2 py-1 rounded-full text-white text-sm"
        style={{
          backgroundColor: color, // Dynamically set the background color of the name box
        }}
      >
        {name}
      </div>
    </div>
  );
}
export default function Logos() {
  return (
    <section className="py-10 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">
          Đồng hành cùng các phòng khám nha khoa uy tín
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-500">
          {/* Replace with actual partner logos */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-xs">LOGO {i}</span>
              </div>
              <span className="text-xl font-bold font-serif text-gray-400 tracking-tight">DentalClinic</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

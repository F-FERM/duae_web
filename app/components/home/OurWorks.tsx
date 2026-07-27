import Image from "next/image";

const workItems = [
  {
    image: "/images/slide1.webp",
    title: "Hoof Cafe",
    description:
      "At Hoof Cafe, we provided customized metal works that blended functionality with modern design. From structural elements to decorative finishes, our craftsmanship added durability and a sleek industrial touch.",
    buttonText: "View Our Works",
  },
  {
    image: "/images/service1.webp",
    title: "Hoof Cafe",
    description:
      "At Hoof Cafe, we provided customized metal works that blended functionality with modern design. From structural elements to decorative finishes, our craftsmanship added durability and a sleek industrial touch.",
    buttonText: "View Our Works",
  },
  {
    image: "/images/slide1.webp",
    title: "Hoof Cafe",
    description:
      "At Hoof Cafe, we provided customized metal works that blended functionality with modern design. From structural elements to decorative finishes, our craftsmanship added durability and a sleek industrial touch.",
    buttonText: "View Our Works",
  },
  {
    image: "/images/service1.webp",
    title: "Hoof Cafe",
    description:
      "At Hoof Cafe, we provided customized metal works that blended functionality with modern design. From structural elements to decorative finishes, our craftsmanship added durability and a sleek industrial touch.",
    buttonText: "View Our Works",
  },
];

export default function OurWorks() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1.6fr] lg:items-center">
          <div className="relative">
            <div className="p-10 sm:p-14">
              <div className="absolute -right-8 top-8 h-24 w-24 rounded-3xl bg-[#f7e4d7] opacity-50 blur-2xl" />
              <h2 className="relative text-5xl font-semibold leading-tight sm:text-6xl xl:text-7xl">
                Our Works
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-slate-900">
            <p className="text-lg text-gray-600 leading-9 pr-10">
              With over 10 years of experience, we have successfully delivered a
              wide range of projects that showcase our expertise in joinery,
              fit-out, renovations, and turnkey solutions. From luxury villas to
              commercial spaces, our works reflect quality, creativity, and
              attention to detail.
            </p>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
          {workItems.map((item, index) => (
            <div
              key={`${item.image}-${index}`}
              className="group relative overflow-hidden  bg-slate-100 shadow-sm"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-slate-950/0 transition duration-300 ease-out group-hover:bg-slate-950/30" />

              <div
                className="absolute left-1/2 top-1/2 z-10 w-[92%] max-w-[320px] -translate-x-1/2 transform opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-hover:-translate-y-6"
                style={{
                  maxHeight: "calc(100% - 24px)",
                }}
              >
                <div
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] overflow-auto"
                  style={{ maxHeight: "100%" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full border border-[#f2c4b0] bg-[#fcd5c1]" />
                    <h3 className="text-2xl font-semibold text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <button className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#dc5c39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb4e2d]">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

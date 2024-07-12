function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <article className="w-full mb-10">
      {/* <!-- Terminal Bar -->        */}
      <section className="flex items-center rounded-t-lg bg-gradient-to-l from-[#a39d9d] to-[#ffffff]">
        <p className="font-semibold p-3">21400@irrmb: ~</p>
      </section>
      {/* <!-- Terminal Body -->         */}
      <section className="bg-black text-white shadow-lg opacity-90 p-3 rounded-b-lg overflow-hidden h-full">
        <ul>{children}</ul>
      </section>
    </article>
  );
}

export default Terminal;

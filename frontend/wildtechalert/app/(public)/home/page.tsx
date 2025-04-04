export default function Home() {
  return (
    <main className="h-full">
      <div className=" text-white h-3/4 bg-green-600 bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col justify-center h-full mx-80 gap-5">
          <p className="text-5xl font-bold">Welcome to WildTechAlert!</p>
          <span className="">
            AI-Powered Real-Time Alerts for Human-Elephant Coexistence
          </span>
        </div>
      </div>
      {/* <div className="flex flex-1">
        <div className="text-5xl">What is it?</div>
        <div className="bg-slate-800 w-full"></div>
      </div> */}
    </main>
  );
}

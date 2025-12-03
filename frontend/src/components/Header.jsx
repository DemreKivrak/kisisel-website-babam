export function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-10 ">
      <div className="bg-gray-500/70 h-10 flex items-center text-[12px] border-b-1 border-gray-200">
        <img
          className="h-5 ml-5 mr-2"
          src="icons8-phone-24.png"
          alt="phone"
        ></img>
        <p className="text-white">
          +90 531 795 40 75 | info@gurtour.com | Gurtour Travel Agency
        </p>
      </div>
      <div className="flex items-center bg-gray-500/70 h-26 w-full">
        <img className="h-12 ml-5" src="logo1.png" alt="logo" />

        <div className="ml-30 flex items-center text-white text-[20px] gap-15">
          {/*menu items*/}
          <a>Home</a>
          <ul>Tours</ul>
          <a>Contact</a>
          <a>About us</a>
        </div>
      </div>
    </div>
  );
}

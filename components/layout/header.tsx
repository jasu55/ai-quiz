import { FaRegUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <div className="w-screen h-16 items-center flex border-b-2 fixed  bg-accent">
      <div className=" font-semibold text-[16px] text-sm:text-[36px] items-center">
        Quiz app
      </div>
      <div className="text-[26px] ml-450">
        <FaRegUserCircle />
      </div>
    </div>
  );
};

export default Header;

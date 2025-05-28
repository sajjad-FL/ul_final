import { Menu, Bell, Grid3X3, User } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm sticky top-0 z-50">
      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-3">
        <Menu className="h-5 w-5 text-gray-600" />
        <h1 className="text-lg font-medium text-gray-900 tracking-tight flex items-center gap-2">
          <img src="/ULTRUS.png" />{" "}
          <h4 className="font-normal text-[24px] leading-[31.92px] align-middle font-poppins">
            Product Stewardship
          </h4>
        </h1>
      </div>

      {/* Right side - Action Icons */}
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-gray-600" />
        <Grid3X3 className="h-5 w-5 text-gray-600" />
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;

import { logoutUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

const Header = () => {
  const { user, setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      setAccessToken(null);
      setUser(null);

      navigate({
        to: "/",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to logout";

      console.log(message);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-800"
        >
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold">
            IdeaDrop
          </h1>
        </Link>

        {/* NAV */}
        <nav className="flex items-center space-x-4">

          <Link
            to="/ideas"
            className="text-gray-600 hover:text-gray-900 font-medium transition px-3 py-2"
          >
            Ideas
          </Link>

          {user && (
            <Link
              to="/ideas/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              + New Idea
            </Link>
          )}

        </nav>

        {/* AUTH */}
        <div className="flex items-center space-x-4">

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-gray-700 font-medium">
                Welcome, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Header;
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutApi } from "../services/loginApi";
import { logoutFailure, logoutRequest, logoutSuccess } from "../store/auth";
import "./Navbar.css";

function Navbar({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const displayName = user?.name || user?.email || "User";
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		function handleOutsideClick(event) {
			if (!menuRef.current?.contains(event.target)) {
				setIsMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	const handleLogout = async () => {
		setIsMenuOpen(false);
		dispatch(logoutRequest());
		try {
			await logoutApi();
			dispatch(logoutSuccess());
			navigate("/");
		} catch (error) {
			dispatch(logoutFailure(error?.message || "Logout failed"));
		}
	};

	 return (
		 <header className="app-navbar">
			 <div className="app-navbar-left">
				 <Link to="/dashboard" className="app-navbar-brand">
					 Clubify
				 </Link>
				 <nav className="app-navbar-links" aria-label="Main navigation">
					 <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
						 Dashboard
					 </Link>
					 <Link to="/meeting" className={location.pathname === "/meeting" ? "active" : ""}>
						 Meetings
					 </Link>
				 </nav>
			 </div>
			 <div className="app-navbar-user-menu" ref={menuRef}>
				 <button
					 type="button"
					 className="app-navbar-user-trigger"
					 onClick={() => setIsMenuOpen((previous) => !previous)}
				 >
					 <span className="app-navbar-user-name">{displayName}</span>
					 <span className="app-navbar-user-chevron" aria-hidden="true">
						 ▾
					 </span>
				 </button>
				 {isMenuOpen && (
					 <div className="app-navbar-dropdown" role="menu" aria-label="User menu">
						 <button type="button" className="app-navbar-dropdown-item" role="menuitem" onClick={handleLogout}>
							 Logout
						 </button>
					 </div>
				 )}
			 </div>
		 </header>
	 );
}

export default Navbar;

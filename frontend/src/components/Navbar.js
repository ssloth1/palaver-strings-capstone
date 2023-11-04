import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


// Navbar compnent that shows up across the top of the page
const Navbar = () => {


    // Get the login status and isAdmin status from the AuthContext
    const { isLoggedIn, isAdmin } = useAuth();
    console.log({ isLoggedIn, isAdmin }); // For debugging

    return (
        <header>
            <nav>                
                {/* Other navigation links we can add will go here later.*/}
                
                {isLoggedIn && isAdmin && (
                    <Link to="/add-user">Create User</Link> // Should only shows this link to logged-in admins
                )}
            </nav>
        </header>
    );
};

export default Navbar;
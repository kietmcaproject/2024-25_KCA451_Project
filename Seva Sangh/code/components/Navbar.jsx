import { useSession, signOut } from 'next-auth/react'; // Import useSession
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import logo from './logo.png';

export default function Navbar() {
  const { data: session } = useSession(); // Get session data

  return (
    <header className={styles.header}>
      {/* Navigation Bar */}
      <nav className={styles.navContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <Image
            src={logo}
            alt="Seva Sangh Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h1 className={styles.logoText}>Seva Sangh</h1>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/" legacyBehavior>
            <a className={styles.navLink}>Home</a>
          </Link>
          <Link href="/donate" legacyBehavior>
            <a className={styles.navLink}>Donate Here</a>
          </Link>
          <Link href="/our-work" legacyBehavior>
            <a className={styles.navLink}>Our Work</a>
          </Link>
          <Link href="/current-stock" legacyBehavior>
            <a className={styles.navLink}>Current Stock</a>
          </Link>

          {/* Conditional Rendering for Login/Profile */}
          {!session ? (
            <Link href="/auth/login" legacyBehavior>
              <a className={styles.navLink}>Login</a>
            </Link>
          ) : (
            <>
              {/* <Link href="/profile" legacyBehavior>
                <a className={styles.navLink}>Profile</a>
              </Link> */}
              <button
                onClick={() => signOut()} // Use signOut to log out
                className={styles.navLink}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Welcome Message */}
      <div className={styles.welcomeMessage}>
        <p className="text-lg font-semibold text-gray-800">
          Welcome to <span className="font-bold">Seva Sangh</span>! Join us in making a difference. Donate and help those in need.
        </p>
      </div>
    </header>
  );
}

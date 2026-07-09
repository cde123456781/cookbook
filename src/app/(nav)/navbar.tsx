"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";

type Session = typeof authClient.$Infer.Session;

export default function Navbar(props: { initialSession: Session | null }) {
  const { data: liveSession, isPending } = authClient.useSession();

  const session = isPending ? props.initialSession : liveSession;

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh(); // re-runs server components like navbar/session
  };



  return (
    <div className="navbar fixed top-0 left-0 z-[9999] w-full bg-base-300 shadow-sm">
  <div className="navbar-start">
    <Link href="/" className="btn btn-ghost text-xl">
      My Cookbook
    </Link>
  </div>

  <div className="navbar-end">
    {/* Desktop */}
    <ul className="menu menu-horizontal hidden lg:flex px-1">
      {session &&
        <li><Link href="/myrecipes">My Recipes</Link></li>
      }
      <li><Link href="/recipes">Recipes</Link></li>
      {session &&
      <li>
        <details>
          <summary>{session.user.displayUsername}</summary>
          <ul className="bg-base-100 rounded-box right-0 w-40 p-2">
            <li><button>My Account</button></li>
            <li><button onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        </details>
      </li> 
}
      {!session && 
      <><li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
      </>
      }     
    </ul>

    {/* Mobile */}
    <div className="dropdown dropdown-end lg:hidden">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
      >
        <li><Link href="/recipes">Recipes</Link></li>
        {session &&
        <>
          <li><Link href="/myrecipes">My Recipes</Link></li>
          <li><button>My Account</button></li>
          <li><button onClick={handleSignOut}>Sign Out</button></li>
        </>
        }
        {!session && 
        <>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Sign Up</Link></li>
        </>
        }    
      </ul>
    </div>
  </div>
</div>
  );
}

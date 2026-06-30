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

  /*
    return (
        <nav className="fixed z-50 flex bg-base-200 w-full items-center justify-between p-4 text-xl font-semibold">
            <div>My Cookbook</div>
        </nav>

    )
        */

  return (
    <div className="bg-base-200 fixed z-50 h-16 w-full rounded-md shadow-sm max-lg:collapse">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>
      <div className="collapse-title navbar">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">
            My Cookbook
          </Link>
        </div>

        <div className="navbar-end">
          <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
        </div>

        <div className="navbar-end hidden lg:flex">
          {(() => {
            if (session == null) {
              return (
                <ul className="menu menu-horizontal px-1">
                  <li>
                    <Link href="/recipes" className="btn">
                      Recipes
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="btn">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="signup" className="btn">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              );
            } else {
              return (
                <ul className="menu menu-horizontal px-1">
                  <li>
                    <Link href="/myrecipes" className="btn">
                      My Recipes
                    </Link>
                  </li>
                  <li>
                    <Link href="/recipes" className="btn">
                      Recipes
                    </Link>
                  </li>
                  <li>
                    <details>
                      <summary className="btn">
                        {session.user.displayUsername}
                      </summary>
                      <ul className="bg-base-100 absolute right-0 z-1 w-40 p-2">
                        <li>
                          <button>My Account</button>
                        </li>
                        <li>
                          <button onClick={handleSignOut}>Sign Out</button>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              );
            }
          })()}
        </div>
      </div>

      <div className="collapse-content z-11 lg:hidden">
        {(() => {
          if (session == null) {
            return (
              <ul className="menu">
                <li>
                  <Link href="/recipes" className="btn">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="btn">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="signup" className="btn">
                    Sign Up
                  </Link>
                </li>
              </ul>
            );
          } else {
            return (
              <ul className="menu">
                <li>
                  <button>My Recipes</button>
                </li>
                <li>
                  <button>Recipes</button>
                </li>
                <li>
                  <button>{session.user.displayUsername}</button>
                  <ul>
                    <li>
                      <button>My Account</button>
                    </li>
                    <li>
                      <button onClick={handleSignOut}>Sign Out</button>
                    </li>
                  </ul>
                </li>
              </ul>
            );
          }
        })()}
      </div>
    </div>
  );
}

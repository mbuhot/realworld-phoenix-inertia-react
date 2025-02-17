import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { PageProps } from "@inertiajs/core";
import { ArrowRight, Shield } from "lucide-react";

import FlashMessage from "./flash_message";
import { SocketProvider } from "@/lib/react_phoenix";

interface CommonPageProps extends PageProps {
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  flash: {
    info?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
}

export default function Layout({ children }) {
  const page = usePage<CommonPageProps>();
  const flash = page.props.flash;
  const user = page.props.user;

  return (
    <SocketProvider
      url={"/socket"}
      options={{ params: { token: (window as any).userToken } }}
    >
      <div className="min-h-screen w-full bg-gray-50">
        {flash?.info && <FlashMessage type="info" message={flash.info} />}
        {flash?.error && <FlashMessage type="error" message={flash.error} />}
        {flash?.warning && (
          <FlashMessage type="warning" message={flash.warning} />
        )}
        {flash?.success && (
          <FlashMessage type="success" message={flash.success} />
        )}

        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/">
                <div className="flex-shrink-0 flex items-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    InsureCompare
                  </span>
                </div>
              </Link>
              {user ? (
                <div className="flex space-x-4">
                  <Link
                    href="/user"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/sign-out"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  >
                    Sign up <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        {children}
      </div>
    </SocketProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Sliders,
  Package,
  Heart,
  ArrowRight,
  Container,
} from "lucide-react";
import Link from "next/link";
import useAuth from "@/src/app/hooks/use-auth";

export default function PreferencesPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const userData = {
    street: "Street 1",
    city: "Austin",
    state: "Texas",
    zipCode: "73781",
    country: "United States",
    phone: "+12555551454",
  };

  const [preferences, setPreferences] = useState({
    mail: false,
    call: false,
    sms: false,
    whatsapp: false,
    email: true,
  });

  const handlePreferenceChange = (channel: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <section className="min-h-screen py-6 md:py-8 lg:py-10">
        <section className="max-w-6xl mx-auto">
          <section className="flex flex-col md:flex-row">
            <section className="w-full md:w-64 mb-6 md:mb-0">
              <section className="bg-gray-50 p-4 rounded-lg">
                <section className="flex flex-col space-y-1">
                  <Link
                    href="/account"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/account/my-data"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Data</span>
                    <User className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/preferences"
                    className="py-2 px-4 bg-gray-200 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Preferences</span>
                    <Sliders className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/orders"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Order History</span>
                    <Package className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Wishlist</span>
                    <Heart className="ml-auto h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium text-left flex items-center"
                  >
                    <span>Log Out</span>
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </button>
                </section>
              </section>
            </section>

            <section className="flex-1 md:ml-8">
              <section className="bg-gray-50 p-6 rounded-lg mb-6">
                <section className="flex items-center">
                  <section className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6 shadow-md">
                    <Sliders
                      className="h-10 w-10 text-black"
                      strokeWidth={1.5}
                    />
                  </section>
                  <section>
                    <h1 className="text-3xl font-bold">MY PREFERENCES</h1>
                    <p className="text-gray-600">
                      Choose your preferred communication channels
                    </p>
                  </section>
                </section>
              </section>

              <section className="mb-8">
                <p className="text-sm">
                  I agree and authorize FINEYST Fashions, Inc. and its
                  affiliated companies and subsidiaries within FINEYST family of
                  companies (&quot;FINEYST&quot;) and otherwise in accordance with the
                  privacy policy to contact me through each of the communication
                  channels indicated below about its newsletters, events, new
                  products, launches, promotional offers and other FINEYST
                  initiatives, even if my phone number is on a corporate, state
                  or national Do Not Call Registry. I understand that I am not
                  obligated to provide this information before making a
                  purchase.
                </p>
                <p className="text-sm font-medium mt-4">
                  Please send me such information by:
                </p>
              </section>

              <section className="space-y-8">
                <section className="flex items-start">
                  <section className="flex h-5 items-center">
                    <input
                      id="mail"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={preferences.mail}
                      onChange={() => handlePreferenceChange("mail")}
                    />
                  </section>
                  <section className="ml-3">
                    <label htmlFor="mail" className="font-medium">
                      Mail
                    </label>
                    <section className="text-sm text-gray-700 mt-1">
                      <p>{userData.street}</p>
                      <p>{userData.city}</p>
                      <p>{userData.state}</p>
                      <p>{userData.zipCode}</p>
                      <p>{userData.country}</p>
                    </section>
                  </section>
                </section>

                <section className="flex items-start">
                  <section className="flex h-5 items-center">
                    <input
                      id="call"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={preferences.call}
                      onChange={() => handlePreferenceChange("call")}
                    />
                  </section>
                  <section className="ml-3">
                    <label htmlFor="call" className="font-medium">
                      Call
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {userData.phone}
                    </p>
                  </section>
                </section>

                <section className="flex items-start">
                  <section className="flex h-5 items-center">
                    <input
                      id="sms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={preferences.sms}
                      onChange={() => handlePreferenceChange("sms")}
                    />
                  </section>
                  <section className="ml-3">
                    <label htmlFor="sms" className="font-medium">
                      SMS/MMS
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {userData.phone}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      SMS Consent: By checking the SMS/MMS box, I agree to
                      receive recurring automated marketing text messages from
                      or on behalf of FINEYST regarding event invitations, new
                      product launches, promotional offers (such as Private
                      Sale), cart reminders, regional and local events and other
                      FINEYST initiatives, at the number provided. Consent not
                      required to purchase goods or services. Text STOP to
                      cancel to 49982. Msg &amp; data rates may apply. For more
                      information about text messages, see our Terms &amp;
                      Conditions &amp; Privacy Policy.
                    </p>
                  </section>
                </section>

                <section className="flex items-start">
                  <section className="flex h-5 items-center">
                    <input
                      id="whatsapp"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={preferences.whatsapp}
                      onChange={() => handlePreferenceChange("whatsapp")}
                    />
                  </section>
                  <section className="ml-3">
                    <label htmlFor="whatsapp" className="font-medium">
                      WhatsApp
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {userData.phone}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      By providing us with your contact information or by using
                      WhatsApp you agree that we can communicate with you via
                      WhatsApp and send you marketing communications via
                      WhatsApp.
                    </p>
                  </section>
                </section>

                <section className="flex items-start">
                  <section className="flex h-5 items-center">
                    <input
                      id="email"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={preferences.email}
                      onChange={() => handlePreferenceChange("email")}
                    />
                  </section>
                  <section className="ml-3">
                    <label htmlFor="email" className="font-medium">
                      E-Mail
                    </label>
                    <p className="text-sm text-gray-700 mt-2">
                      Receive information about exclusive events, product
                      launches, fashions shows, promotional offers, sales, new
                      arrivals and other communication initiatives.
                    </p>
                  </section>
                </section>
              </section>

              <section className="mt-8 space-y-6 text-sm">
                <p>
                  By providing my consent I authorize FINEYST Fashions, Inc. and
                  its affiliated companies and subsidiaries within FINEYST
                  family of companies (&quot;FINEYST&quot;) and otherwise in accordance
                  with the privacy policy to contact me through e-mail. I
                  understand that I am not obligated to provide this information
                  before making a purchase.
                </p>

                <p>
                  Your consent is voluntary. There are no disadvantages to
                  withholding or withdrawing your consent. You have the right to
                  revoke your consent at any time. Revocation of consent does
                  not affect the lawfulness of the processing of your personal
                  data performed on the basis of the consent up to the time of
                  revocation. You can revoke your consent here under the
                  category &quot;My communication&quot; by clicking on the specific
                  communication channel or at experience@fineyst.com.
                </p>
              </section>

              <section className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="bg-black text-white px-8 py-3 font-bold"
                >
                  SAVE
                </button>
              </section>
            </section>
          </section>
        </section>
      </section>
    </Container>
  );
}

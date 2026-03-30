import Link from "next/link";

export default async function LeadAcceptedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  if (status === "invalid") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Invalid Link</h1>
          <p className="text-gray-500 text-sm">
            This accept link is invalid or has expired. Please contact{" "}
            <a href="mailto:care@hospitalguru.com" className="text-teal-600 font-semibold">
              care@hospitalguru.com
            </a>{" "}
            if you believe this is an error.
          </p>
        </div>
      </main>
    );
  }

  if (status === "already") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">ℹ️</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Already Accepted</h1>
          <p className="text-gray-500 text-sm">
            This lead has already been accepted. The patient&apos;s contact details were sent to you
            when you first accepted. Check your inbox or contact{" "}
            <a href="mailto:care@hospitalguru.com" className="text-teal-600 font-semibold">
              care@hospitalguru.com
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  // status === "success"
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Green header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-10 py-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-2xl font-black text-white">Lead Accepted!</h1>
          <p className="text-teal-100 text-sm mt-1">Thank you for partnering with HospitalGuru</p>
        </div>

        {/* Body */}
        <div className="px-10 py-8 text-center">
          <p className="text-gray-700 text-base mb-6 leading-relaxed">
            The patient&apos;s full contact details have been sent to your email inbox. Please
            reach out to them <strong>within 24 hours</strong>.
          </p>

          {/* Reminder box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 text-left mb-8">
            <p className="text-sm font-bold text-amber-800 mb-1">⚠️ Reminder</p>
            <p className="text-sm text-amber-700">
              You have committed to offering this patient the{" "}
              <strong>HospitalGuru Special — minimum 10% discount</strong> on your published
              treatment rates.
            </p>
          </div>

          {/* Next steps */}
          <div className="text-left mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Suggested Next Steps
            </p>
            <ol className="space-y-2 text-sm text-gray-600 list-none">
              <li className="flex gap-3 items-start">
                <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">1</span>
                Contact the patient via WhatsApp or email within 24 hours
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">2</span>
                Share your treatment plan and cost estimate with the 10% discount applied
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">3</span>
                CC <a href="mailto:care@hospitalguru.com" className="text-teal-600 font-semibold">care@hospitalguru.com</a> for coordination support
              </li>
            </ol>
          </div>

          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Back to HospitalGuru
          </Link>
        </div>
      </div>
    </main>
  );
}

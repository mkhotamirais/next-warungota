import { auth } from "@/auth";
import { baseUrl } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => null);

  const { searchParams } = new URL(req.url);
  const callbackUrl = body.callbackUrl || searchParams.get("callbackUrl") || "/";

  if (!session || !session.user || !session.user.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.emailVerified) redirect("/");

  const userEmail = session.user.email;

  try {
    let response;
    if (session.user.pendingEmail) {
      // await sendEmailChangeVerification(session.user.pendingEmail, session.user.id);
      response = await fetch(`${baseUrl}/api/emails/send-email-change-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: session.user.pendingEmail, userId: session.user.id, callbackUrl }),
      });
    } else {
      // await sendEmailVerification(userEmail, session.user.id);
      response = await fetch(`${baseUrl}/api/emails/send-email-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, userId: session.user.id, callbackUrl }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send email via API");
    }

    return Response.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error sending verification email:", error);
    return Response.json({ error: "Failed to send verification email." }, { status: 500 });
  }
}

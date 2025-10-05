import { auth } from "@/auth";
import { sendVerificationEmail } from "@/actions/send-verification";

export async function POST() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  try {
    await sendVerificationEmail(userEmail);

    return Response.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return Response.json(
      { message: "Failed to send verification email. Check server logs." },
      {
        status: 500,
      }
    );
  }
}

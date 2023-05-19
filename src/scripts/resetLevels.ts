import { prisma } from "@/lib";
import prompt from "prompt";

prompt.start();
// ask user to confirm

(async () => {
  const { confirm } = await prompt.get([
    {
      name: "confirm",
      required: true,
      description: "Are you sure you want to reset all users? (y/n)",
    },
  ]);

  if (confirm !== "y") {
    console.log("Cancelled");
    process.exit(0);
  }
  const result = await prisma.user.updateMany({
    data: {
      xp: 0,
      currency: 0,
    },
    where: {},
  });
  console.log(`Reset ${result.count} users`);
})();

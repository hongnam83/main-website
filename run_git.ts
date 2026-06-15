import { execSync } from "child_process";
try {
  console.log(execSync("git log -p src/components/Testimonials.tsx").toString());
} catch (e: unknown) {
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log(String(e));
  }
}
